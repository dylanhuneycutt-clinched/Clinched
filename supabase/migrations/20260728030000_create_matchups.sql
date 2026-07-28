create table if not exists public.matchups (
  id uuid primary key default gen_random_uuid(),
  sport text not null check (sport in ('NFL', 'NBA', 'MLB')),
  week integer not null,
  home_team text not null,
  away_team text not null,
  home_score numeric default 0,
  away_score numeric default 0,
  winner text default null,
  is_complete boolean default false,
  created_at timestamptz not null default now()
);
alter table public.matchups enable row level security;
create policy "Matchups are viewable by everyone" on public.matchups for select using (true);
create policy "Commissioner can manage matchups" on public.matchups for all using (auth.jwt() ->> 'email' = 'dylanhuneycutt5@gmail.com');
