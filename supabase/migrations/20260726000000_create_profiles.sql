-- Profiles table: one row per registered user, holding the team they were
-- randomly assigned at signup. Only 12 teams exist and each can be claimed
-- once (enforced by the unique constraint on team_name).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  team_name text not null unique,
  team_color text not null,
  created_at timestamptz not null default now(),
  constraint profiles_team_name_valid check (
    team_name in (
      'Team Teal', 'Team White', 'Team Silver', 'Team Red',
      'Team Blue', 'Team Green', 'Team Purple', 'Team Pink',
      'Team Orange', 'Team Crimson', 'Team Bronze', 'Team Frost'
    )
  )
);

alter table public.profiles enable row level security;

-- Team rosters (name/owner/color) are league-public info, and need to be
-- readable before login too (the signup screen checks whether the league
-- is full), so this policy has no `to` clause and applies to anon + authenticated.
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- No insert/update/delete policies: rows are only ever written by the
-- security-definer trigger below, never directly by a client.

-- Assigns a random unclaimed team to every new auth user. Runs as an
-- AFTER INSERT trigger so the profiles.id -> auth.users(id) foreign key is
-- satisfiable; raising an exception here still rolls back the entire
-- transaction (including the auth.users insert), which is what lets
-- supabase.auth.signUp() surface a "league is full" style error.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text := coalesce(new.raw_user_meta_data ->> 'full_name', '');
  v_attempts int := 0;
  v_claimed boolean := false;
begin
  while v_attempts < 12 and not v_claimed loop
    v_attempts := v_attempts + 1;

    begin
      insert into public.profiles (id, full_name, team_name, team_color)
      select new.id, v_full_name, t.name, t.color
      from (
        values
          ('Team Teal', '#008080'),
          ('Team White', '#FFFFFF'),
          ('Team Silver', '#6e6b6b'),
          ('Team Red', '#FF0000'),
          ('Team Blue', '#4169E1'),
          ('Team Green', '#00C851'),
          ('Team Purple', '#7B2D8B'),
          ('Team Pink', '#FF69B4'),
          ('Team Orange', '#FF8C00'),
          ('Team Crimson', '#DC143C'),
          ('Team Bronze', '#8B6914'),
          ('Team Frost', '#B0E0E6')
      ) as t (name, color)
      where t.name not in (select p.team_name from public.profiles p)
      order by random()
      limit 1;

      if found then
        v_claimed := true;
      else
        exit;
      end if;
    exception when unique_violation then
      -- Lost the race to another concurrent signup for that team; retry
      -- with whatever teams remain unclaimed.
      null;
    end;
  end loop;

  if not v_claimed then
    raise exception 'League is full';
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
