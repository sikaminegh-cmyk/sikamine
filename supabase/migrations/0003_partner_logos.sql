-- Banking partner / regulatory body logos shown in the trust carousel above the footer.

create table partner_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'partner', -- e.g. banking_partner | regulatory_body | partner
  logo_url text not null,
  link_url text,
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_partner_logos_updated before update on partner_logos
  for each row execute function set_updated_at();

alter table partner_logos enable row level security;

create policy partner_logos_public_select on partner_logos for select
  using (visible or is_admin());
create policy partner_logos_admin_write on partner_logos for all
  using (is_admin()) with check (is_admin());
