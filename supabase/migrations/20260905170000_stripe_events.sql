-- Stripe webhook idempotency + print coupon session key

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- No client policies: service role only (webhooks)

alter table public.print_coupons
  add column if not exists stripe_session_id text;

create unique index if not exists print_coupons_stripe_session_idx
  on public.print_coupons (stripe_session_id)
  where stripe_session_id is not null;
