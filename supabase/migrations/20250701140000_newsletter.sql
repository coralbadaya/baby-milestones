-- Nestbean: newsletter subscribers, templates, campaigns, sends

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'active'
    check (status in ('active', 'unsubscribed', 'bounced')),
  source text not null default 'footer'
    check (source in ('footer', 'import', 'manual')),
  unsubscribe_token uuid not null default gen_random_uuid(),
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  constraint newsletter_subscribers_email_unique unique (email)
);

create unique index if not exists newsletter_subscribers_unsubscribe_token_idx
  on public.newsletter_subscribers (unsubscribe_token);

alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_subscribers_staff_select"
  on public.newsletter_subscribers for select
  to authenticated
  using (public.is_staff());

create policy "newsletter_subscribers_admin_insert"
  on public.newsletter_subscribers for insert
  to authenticated
  with check (public.is_admin());

create policy "newsletter_subscribers_admin_update"
  on public.newsletter_subscribers for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- newsletter_templates
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  subject text not null,
  preview_text text,
  body_html text not null,
  body_text text not null,
  is_system boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.newsletter_templates enable row level security;

create policy "newsletter_templates_staff_select"
  on public.newsletter_templates for select
  to authenticated
  using (public.is_staff());

create policy "newsletter_templates_admin_all"
  on public.newsletter_templates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- newsletter_campaigns
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.newsletter_templates (id) on delete set null,
  name text not null,
  subject text not null default '',
  preview_text text,
  body_html text not null default '',
  body_text text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_campaigns_status_scheduled_idx
  on public.newsletter_campaigns (status, scheduled_at)
  where status in ('scheduled', 'sending');

alter table public.newsletter_campaigns enable row level security;

create policy "newsletter_campaigns_staff_select"
  on public.newsletter_campaigns for select
  to authenticated
  using (public.is_staff());

create policy "newsletter_campaigns_admin_all"
  on public.newsletter_campaigns for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- newsletter_sends (audit + dedupe)
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_sends (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.newsletter_campaigns (id) on delete cascade,
  subscriber_id uuid not null references public.newsletter_subscribers (id) on delete cascade,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed')),
  provider_id text,
  error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (campaign_id, subscriber_id)
);

create index if not exists newsletter_sends_campaign_status_idx
  on public.newsletter_sends (campaign_id, status);

alter table public.newsletter_sends enable row level security;

create policy "newsletter_sends_staff_select"
  on public.newsletter_sends for select
  to authenticated
  using (public.is_staff());

-- Inserts/updates from edge functions use service role (bypasses RLS)

-- ---------------------------------------------------------------------------
-- Public subscribe / unsubscribe (security definer)
-- ---------------------------------------------------------------------------

create or replace function public.subscribe_newsletter(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_row public.newsletter_subscribers%rowtype;
begin
  if v_email is null or v_email = '' or position('@' in v_email) = 0 then
    raise exception 'Invalid email address';
  end if;

  select * into v_row from public.newsletter_subscribers where email = v_email;

  if found then
    if v_row.status = 'active' then
      return jsonb_build_object('success', true, 'already_subscribed', true);
    end if;

    update public.newsletter_subscribers
    set status = 'active',
        source = 'footer',
        subscribed_at = now(),
        unsubscribed_at = null
    where id = v_row.id;

    return jsonb_build_object('success', true, 'reactivated', true);
  end if;

  insert into public.newsletter_subscribers (email, status, source)
  values (v_email, 'active', 'footer');

  return jsonb_build_object('success', true, 'already_subscribed', false);
end;
$$;

create or replace function public.unsubscribe_newsletter(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.newsletter_subscribers%rowtype;
begin
  select * into v_row
  from public.newsletter_subscribers
  where unsubscribe_token = p_token;

  if not found then
    return jsonb_build_object('success', false, 'error', 'invalid_token');
  end if;

  if v_row.status = 'unsubscribed' then
    return jsonb_build_object('success', true, 'already_unsubscribed', true);
  end if;

  update public.newsletter_subscribers
  set status = 'unsubscribed', unsubscribed_at = now()
  where id = v_row.id;

  return jsonb_build_object('success', true, 'email', v_row.email);
end;
$$;

grant execute on function public.subscribe_newsletter(text) to anon, authenticated;
grant execute on function public.unsubscribe_newsletter(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Grants (Data API)
-- ---------------------------------------------------------------------------

grant select, insert, update on public.newsletter_subscribers to authenticated;
grant select, insert, update, delete on public.newsletter_templates to authenticated;
grant select, insert, update, delete on public.newsletter_campaigns to authenticated;
grant select on public.newsletter_sends to authenticated;

-- ---------------------------------------------------------------------------
-- Seed system templates
-- ---------------------------------------------------------------------------

insert into public.newsletter_templates (
  slug, name, description, subject, preview_text, body_html, body_text, is_system
) values
(
  'welcome',
  'Welcome to Nestbean',
  'Sent after footer signup — gentle introduction to the list.',
  'Welcome to Nestbean — gentle notes for your journey',
  'Your curated companion for milestones, care, and calm.',
  '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3d3835;">Welcome to Nestbean. We''re glad you''re here.</p>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3d3835;">From time to time, we''ll send quiet, editorial notes — milestone highlights, one thoughtful activity, and reminders that care for you matters too. No clutter, no daily noise.</p>
<p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#3d3835;">When you''re ready, open Today for a calm read tailored to your week.</p>
<p style="margin:0 0 24px;"><a href="{{site_url}}" style="display:inline-block;padding:12px 24px;background:#8b7355;color:#fff;text-decoration:none;border-radius:6px;font-size:15px;">Open Today</a></p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#6b6560;">Warmly,<br>The Nestbean team</p>',
  'Welcome to Nestbean. We''re glad you''re here.

From time to time, we''ll send quiet, editorial notes — milestone highlights, one thoughtful activity, and reminders that care for you matters too.

Open Today: {{site_url}}

Warmly,
The Nestbean team',
  true
),
(
  'monthly-digest',
  'This month with your little one',
  'Monthly digest with milestone highlight and one DIY activity.',
  'Month {{baby_month}} — what to watch for and one activity to try',
  'A short read for the week ahead.',
  '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3d3835;">A new month brings new curiosity — for your little one and for you.</p>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3d3835;"><strong>Watch for:</strong> small shifts in movement, sound, and connection. Every baby finds their own rhythm.</p>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3d3835;"><strong>Try this week:</strong> one simple DIY activity from your month page — five calm minutes together.</p>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3d3835;"><strong>For you:</strong> drink water before you reach for your phone in the morning. Small rituals anchor long days.</p>
<p style="margin:0 0 24px;"><a href="{{site_url}}/baby" style="display:inline-block;padding:12px 24px;background:#8b7355;color:#fff;text-decoration:none;border-radius:6px;font-size:15px;">View this month</a></p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#6b6560;">With care,<br>The Nestbean team</p>',
  'A new month brings new curiosity — for your little one and for you.

Watch for: small shifts in movement, sound, and connection.
Try this week: one simple DIY activity from your month page.
For you: drink water before you reach for your phone in the morning.

View this month: {{site_url}}/baby

With care,
The Nestbean team',
  true
),
(
  'product-update',
  'What''s new at Nestbean',
  'Product update with feature highlights.',
  'New on Nestbean — {{feature_name}}',
  'A quick look at what we''ve added for you.',
  '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3d3835;">We''ve been refining Nestbean for calmer, more considered early motherhood. Here''s what''s new:</p>
<ul style="margin:0 0 16px;padding-left:20px;font-size:16px;line-height:1.7;color:#3d3835;">
<li><strong>First Moments</strong> — a gentle photo journal for life''s small firsts.</li>
<li><strong>DIY activity images</strong> — curated visuals for every month''s play ideas.</li>
<li><strong>Editorial refresh</strong> — quieter layouts across Today and My Baby.</li>
</ul>
<p style="margin:0 0 24px;"><a href="{{site_url}}" style="display:inline-block;padding:12px 24px;background:#8b7355;color:#fff;text-decoration:none;border-radius:6px;font-size:15px;">Explore Nestbean</a></p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#6b6560;">Thank you for being here,<br>The Nestbean team</p>',
  'We''ve been refining Nestbean for calmer, more considered early motherhood.

- First Moments — a gentle photo journal for life''s small firsts.
- DIY activity images — curated visuals for every month''s play ideas.
- Editorial refresh — quieter layouts across Today and My Baby.

Explore: {{site_url}}

Thank you for being here,
The Nestbean team',
  true
)
on conflict (slug) do nothing;
