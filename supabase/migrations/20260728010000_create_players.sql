-- Players table: league-wide roster data synced in from SportsDataIO
-- (see services/sync-players.ts). Read is public like profiles; writes only
-- ever happen via the sync script's service-role client, so there are no
-- insert/update/delete policies for anon/authenticated.
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  team text not null,
  sport text not null check (sport in ('NFL', 'NBA', 'MLB')),
  external_id text not null,
  created_at timestamptz not null default now(),
  unique (sport, external_id)
);

alter table public.players enable row level security;

create policy "Players are viewable by everyone"
  on public.players for select
  using (true);
