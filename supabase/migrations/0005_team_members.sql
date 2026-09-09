-- Leadership / team members shown in a grid on the About page.

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  bio text,
  photo_url text,
  email text,
  linkedin_url text,
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_team_members_updated before update on team_members
  for each row execute function set_updated_at();

alter table team_members enable row level security;

create policy team_members_public_select on team_members for select
  using (visible or is_admin());
create policy team_members_admin_write on team_members for all
  using (is_admin()) with check (is_admin());

-- Add a Team Members grid to the About page, right after the CEO message.
update page_sections
set position = position + 1
where page_id = (select id from pages where slug = 'about') and position >= 6;

insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'team_grid', 'Our Leadership Team', 'The people building Sikamine''s governance-led approach to gold trading.', 'alt', 6, true
from pages where slug = 'about';
