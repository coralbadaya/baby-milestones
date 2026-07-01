import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { buildEmailPayload, sendViaResend } from '../_shared/newsletterEmail.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    let subject = body.subject as string;
    let previewText = body.preview_text as string | null;
    let bodyHtml = body.body_html as string;
    let bodyText = body.body_text as string;

    if (body.campaign_id) {
      const { data: campaign } = await adminClient
        .from('newsletter_campaigns')
        .select('*')
        .eq('id', body.campaign_id)
        .maybeSingle();
      if (campaign) {
        subject = campaign.subject;
        previewText = campaign.preview_text;
        bodyHtml = campaign.body_html;
        bodyText = campaign.body_text;
      }
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://nestbean.app';
    const mergeContext = {
      site_url: siteUrl,
      unsubscribe_url: `${siteUrl}/newsletter/unsubscribe?token=sample`,
      subscriber_email: user.email,
      year: String(new Date().getFullYear()),
    };

    const email = buildEmailPayload({
      to: user.email,
      subject,
      previewText,
      bodyHtml,
      bodyText,
      mergeContext,
      sample: true,
    });

    const { providerId } = await sendViaResend({
      to: user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      previewText,
    });

    return new Response(JSON.stringify({ success: true, provider_id: providerId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
