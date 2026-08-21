create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text, role text not null default 'user' check (role in ('user','developer','support','admin','super_admin')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null, user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')), content text not null, model_id text, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create index if not exists messages_user_created_idx on public.messages(user_id, created_at desc);
create table if not exists public.usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade, day date not null, requests integer not null default 0, input_tokens bigint not null default 0, output_tokens bigint not null default 0,
  primary key(user_id, day)
);
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, provider text not null,
  provider_subscription_id text not null, status text not null, current_period_end timestamptz, raw_event_id text, updated_at timestamptz not null default now(), unique(provider, provider_subscription_id)
);
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(), provider text not null, provider_event_id text not null unique, amount numeric(12,2), currency text, status text not null, payload jsonb not null default '{}', created_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key, actor_id uuid, action text not null, target_type text, target_id text, ip_hash text, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
alter table public.profiles enable row level security; alter table public.messages enable row level security; alter table public.usage_daily enable row level security; alter table public.subscriptions enable row level security;
create policy "own profile" on public.profiles for select using (auth.uid() = id);
create policy "own messages" on public.messages for select using (auth.uid() = user_id);
create policy "own usage" on public.usage_daily for select using (auth.uid() = user_id);
create policy "own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
