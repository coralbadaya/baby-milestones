import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { buildEmailPayload, sendViaResend } from '../_shared/newsletterEmail.ts';

const CRON_SECRET = Deno.env.get('NEWSLETTER_CRON_SECRET');
const BATCH_SIZE = 50;

function isAuthorized(req: Request): boolean {
  const cronHeader = req.headers.get('x-cron-secret');
  if (CRON_SECRET && cronHeader === CRON_SECRET) return true;
  const auth = req.headers.get('Authorization');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return Boolean(serviceKey && auth === `Bearer ${serviceKey}`);
}

Deno.serve(async (req) => {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const siteUrl = Deno.env.get('SITE_URL') || 'https://nestbean.app';
  const admin = createClient(supabaseUrl, serviceKey);

  const summary = { campaigns: 0, sent: 0, failed: 0 };

  try {
    const now = new Date().toISOString();

    const { data: dueCampaigns } = await admin
      .from('newsletter_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(3);

    for (const campaign of dueCampaigns || []) {
      summary.campaigns += 1;

      await admin
        .from('newsletter_campaigns')
        .update({ status: 'sending', updated_at: now })
        .eq('id', campaign.id);

      const { data: subscribers } = await admin
        .from('newsletter_subscribers')
        .select('id, email, unsubscribe_token')
        .eq('status', 'active');

      const { data: existingSends } = await admin
        .from('newsletter_sends')
        .select('subscriber_id')
        .eq('campaign_id', campaign.id);

      const sentSet = new Set((existingSends || []).map((s) => s.subscriber_id));
      const pending = (subscribers || []).filter((s) => !sentSet.has(s.id)).slice(0, BATCH_SIZE);

      if (pending.length === 0) {
        const { count: totalSent } = await admin
          .from('newsletter_sends')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .eq('status', 'sent');

        await admin
          .from('newsletter_campaigns')
          .update({
            status: 'sent',
            sent_at: now,
            recipient_count: totalSent ?? 0,
            updated_at: now,
          })
          .eq('id', campaign.id);
        continue;
      }

      for (const sub of pending) {
        const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;
        const mergeContext = {
          site_url: siteUrl,
          unsubscribe_url: unsubscribeUrl,
          subscriber_email: sub.email,
          year: String(new Date().getFullYear()),
        };

        const email = buildEmailPayload({
          to: sub.email,
          subject: campaign.subject,
          previewText: campaign.preview_text,
          bodyHtml: campaign.body_html,
          bodyText: campaign.body_text,
          mergeContext,
        });

        try {
          const { providerId } = await sendViaResend({
            to: sub.email,
            subject: email.subject,
            html: email.html,
            text: email.text,
            previewText: campaign.preview_text,
          });

          await admin.from('newsletter_sends').upsert({
            campaign_id: campaign.id,
            subscriber_id: sub.id,
            status: 'sent',
            provider_id: providerId,
            sent_at: new Date().toISOString(),
          }, { onConflict: 'campaign_id,subscriber_id' });

          summary.sent += 1;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Send failed';
          await admin.from('newsletter_sends').upsert({
            campaign_id: campaign.id,
            subscriber_id: sub.id,
            status: 'failed',
            error: message,
          }, { onConflict: 'campaign_id,subscriber_id' });
          summary.failed += 1;
        }
      }

      const { count: activeCount } = await admin
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: sentCount } = await admin
        .from('newsletter_sends')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id)
        .in('status', ['sent', 'failed']);

      if ((sentCount ?? 0) >= (activeCount ?? 0)) {
        const { count: successCount } = await admin
          .from('newsletter_sends')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .eq('status', 'sent');

        await admin
          .from('newsletter_campaigns')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            recipient_count: successCount ?? 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', campaign.id);
      }
    }

    return new Response(JSON.stringify({ success: true, ...summary }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, ...summary }), { status: 500 });
  }
});
