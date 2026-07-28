-- Renames "Team Silver" (#6e6b6b) to "Team Neon" (#39FF14) league-wide.
-- Existing rows are migrated first so the new check constraint (which no
-- longer allows 'Team Silver') can validate all rows without failing.
update public.profiles
set team_name = 'Team Neon', team_color = '#39FF14'
where team_name = 'Team Silver';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_team_name_valid;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_team_name_valid CHECK (team_name IN ('Team Teal', 'Team White', 'Team Neon', 'Team Red', 'Team Blue', 'Team Green', 'Team Purple', 'Team Pink', 'Team Orange', 'Team Crimson', 'Team Bronze', 'Team Frost'));

-- Keep the signup trigger's team pool in sync so newly claimed teams never
-- get the old Team Silver name/color again.
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
          ('Team Neon', '#39FF14'),
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
      null;
    end;
  end loop;

  if not v_claimed then
    raise exception 'League is full';
  end if;

  return new;
end;
$$;
