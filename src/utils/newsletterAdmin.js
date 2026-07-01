import { supabase } from './supabaseClient';

export async function fetchCampaigns() {
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchCampaign(id) {
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchTemplates() {
  const { data, error } = await supabase
    .from('newsletter_templates')
    .select('*')
    .order('is_system', { ascending: false })
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function fetchSubscribers() {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function countActiveSubscribers() {
  const { count, error } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  if (error) throw error;
  return count ?? 0;
}

export async function createCampaign(payload) {
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCampaign(id, patch) {
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function duplicateCampaign(campaign) {
  return createCampaign({
    template_id: campaign.template_id,
    name: `${campaign.name} (copy)`,
    subject: campaign.subject,
    preview_text: campaign.preview_text,
    body_html: campaign.body_html,
    body_text: campaign.body_text,
    status: 'draft',
  });
}

export async function cancelSchedule(id) {
  return updateCampaign(id, { status: 'draft', scheduled_at: null });
}

export async function scheduleCampaign(id, scheduledAt) {
  return updateCampaign(id, {
    status: 'scheduled',
    scheduled_at: scheduledAt,
  });
}

export async function sendCampaignNow(id) {
  return updateCampaign(id, {
    status: 'scheduled',
    scheduled_at: new Date().toISOString(),
  });
}

export async function saveTemplateFromCampaign(campaign, { slug, name, description }) {
  const { data, error } = await supabase
    .from('newsletter_templates')
    .insert({
      slug,
      name,
      description: description || null,
      subject: campaign.subject,
      preview_text: campaign.preview_text,
      body_html: campaign.body_html,
      body_text: campaign.body_text,
      is_system: false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTemplate(id, patch) {
  const { data, error } = await supabase
    .from('newsletter_templates')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTemplate(id) {
  const { error } = await supabase
    .from('newsletter_templates')
    .delete()
    .eq('id', id)
    .eq('is_system', false);
  if (error) throw error;
}

export async function addSubscriberManual(email) {
  const normalized = email.trim().toLowerCase();
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, status')
    .eq('email', normalized)
    .maybeSingle();

  if (existing) {
    if (existing.status === 'active') {
      return { duplicate: true };
    }
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'active', source: 'manual', unsubscribed_at: null, subscribed_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return { data, reactivated: true };
  }

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: normalized, status: 'active', source: 'manual' })
    .select()
    .single();
  if (error) throw error;
  return { data };
}

export async function subscribeFooter(email) {
  const { data, error } = await supabase.rpc('subscribe_newsletter', { p_email: email });
  if (error) throw error;
  return data;
}

export async function fetchCampaignSendStats(campaignId) {
  const { data, error } = await supabase
    .from('newsletter_sends')
    .select('status')
    .eq('campaign_id', campaignId);
  if (error) throw error;
  const stats = { sent: 0, failed: 0, queued: 0 };
  for (const row of data || []) {
    stats[row.status] = (stats[row.status] || 0) + 1;
  }
  return stats;
}

export async function invokeSendTest(payload) {
  const { data, error } = await supabase.functions.invoke('newsletter-send-test', {
    body: payload,
  });
  if (error) throw error;
  return data;
}

export function subscribersToCsv(rows) {
  const header = 'email,status,source,subscribed_at';
  const lines = rows.map((r) =>
    [r.email, r.status, r.source, r.subscribed_at].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','),
  );
  return [header, ...lines].join('\n');
}
