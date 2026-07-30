-- ============================================================================
-- Verdikt — initial schema
--
-- Design notes:
--   • Row Level Security is ON for every table; access is expressed as policy,
--     not enforced in application code. The service-role key bypasses RLS for
--     trusted server jobs only.
--   • `profiles` mirrors `auth.users` 1:1 and is auto-provisioned by a trigger,
--     so application code never inserts users manually.
--   • Reports denormalize a few hot columns for list queries while keeping the
--     full report JSON in `payload`.
-- ============================================================================

-- Enums -----------------------------------------------------------------------
create type public.user_plan as enum ('free', 'pro', 'enterprise');
create type public.verdict_status as enum ('clear', 'caution', 'flagged');
create type public.report_status as enum (
  'pending', 'processing', 'complete', 'failed'
);

-- Shared: keep updated_at fresh -----------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Profiles --------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  plan        public.user_plan not null default 'free',
  credits     integer not null default 3 check (credits >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-provision a profile whenever an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Vehicle reports -------------------------------------------------------------
create table public.vehicle_reports (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  vin            text not null check (char_length(vin) = 17),
  year           integer,
  make           text,
  model          text,
  trim           text,
  verdict_score  integer check (verdict_score between 0 and 100),
  verdict_status public.verdict_status,
  summary        text,
  payload        jsonb not null default '{}'::jsonb,
  status         public.report_status not null default 'complete',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger vehicle_reports_set_updated_at
  before update on public.vehicle_reports
  for each row execute function public.set_updated_at();

create index vehicle_reports_user_id_created_at_idx
  on public.vehicle_reports (user_id, created_at desc);
create index vehicle_reports_vin_idx on public.vehicle_reports (vin);

alter table public.vehicle_reports enable row level security;

create policy "Reports are owned by their creator"
  on public.vehicle_reports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Watchlist -------------------------------------------------------------------
create table public.watchlist_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  vin           text not null check (char_length(vin) = 17),
  label         text,
  target_price  integer check (target_price >= 0),
  notes         text,
  created_at    timestamptz not null default now(),
  unique (user_id, vin)
);

create index watchlist_items_user_id_idx on public.watchlist_items (user_id);

alter table public.watchlist_items enable row level security;

create policy "Watchlist items are owned by their creator"
  on public.watchlist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
