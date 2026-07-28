-- Roster assignments: which player fills which slot on which team, per
-- sport. Reads are public (league rosters are public info, same as
-- profiles/players); writes are restricted to the commissioner's own auth
-- email so the client-side commissioner screen isn't the only thing
-- enforcing that gate.
create table if not exists public.roster_players (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  sport text not null check (sport in ('NFL', 'NBA', 'MLB')),
  slot_position text not null,
  created_at timestamptz not null default now(),
  unique (profile_id, sport, slot_position),
  unique (player_id)
);

alter table public.roster_players enable row level security;

create policy "Roster players are viewable by everyone"
  on public.roster_players for select
  using (true);

create policy "Commissioner can assign roster players"
  on public.roster_players for insert
  with check (auth.jwt() ->> 'email' = 'dylanhuneycutt5@gmail.com');

create policy "Commissioner can update roster players"
  on public.roster_players for update
  using (auth.jwt() ->> 'email' = 'dylanhuneycutt5@gmail.com')
  with check (auth.jwt() ->> 'email' = 'dylanhuneycutt5@gmail.com');

create policy "Commissioner can remove roster players"
  on public.roster_players for delete
  using (auth.jwt() ->> 'email' = 'dylanhuneycutt5@gmail.com');
