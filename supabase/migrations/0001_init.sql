-- Sikamine Gold Trading Ltd — core schema (Phase 1)
-- Run via `supabase db push` or the Supabase SQL editor. See docs/DATABASE.md.

create extension if not exists pgcrypto;

-- ── enums ────────────────────────────────────────────────────────────────
create type admin_role as enum ('super_admin', 'administrator', 'editor');
create type admin_status as enum ('active', 'inactive');
create type contact_status as enum ('new', 'read', 'responded', 'archived');
create type partnership_status as enum ('new', 'reviewing', 'contacted', 'qualified', 'declined', 'completed');
create type nav_location as enum ('header', 'footer');
create type legal_doc_type as enum ('terms', 'privacy', 'cookies', 'disclaimer', 'responsible_sourcing_policy');
create type active_status as enum ('active', 'inactive');

-- ── updated_at trigger helper ───────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── admin_users ──────────────────────────────────────────────────────────
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role admin_role not null default 'editor',
  status admin_status not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_admin_users_updated before update on admin_users
  for each row execute function set_updated_at();

-- helper: current user's admin row (security definer avoids RLS recursion)
create or replace function current_admin()
returns admin_users as $$
  select * from admin_users where user_id = auth.uid() and status = 'active' limit 1;
$$ language sql stable security definer set search_path = public;

create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from current_admin());
$$ language sql stable security definer set search_path = public;

create or replace function has_admin_role(roles admin_role[])
returns boolean as $$
  select exists (select 1 from current_admin() where role = any(roles));
$$ language sql stable security definer set search_path = public;

-- ── pages + page_sections ───────────────────────────────────────────────
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_pages_updated before update on pages
  for each row execute function set_updated_at();

create table page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  type text not null,
  title text,
  subtitle text,
  body text,
  image_url text,
  video_url text,
  cta_label text,
  cta_url text,
  secondary_cta_label text,
  secondary_cta_url text,
  background_style text not null default 'light',
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_page_sections_updated before update on page_sections
  for each row execute function set_updated_at();
create index idx_page_sections_page on page_sections(page_id, position);

-- ── services ─────────────────────────────────────────────────────────────
create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  icon text,
  image_url text,
  seo_title text,
  seo_description text,
  published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_services_updated before update on services
  for each row execute function set_updated_at();

-- ── pillars ──────────────────────────────────────────────────────────────
create table pillars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  number text,
  description text,
  icon text,
  position integer not null default 0,
  status active_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_pillars_updated before update on pillars
  for each row execute function set_updated_at();

-- ── partner_categories ───────────────────────────────────────────────────
create table partner_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  position integer not null default 0,
  status active_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_partner_categories_updated before update on partner_categories
  for each row execute function set_updated_at();

-- ── office_locations ─────────────────────────────────────────────────────
create table office_locations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  is_headquarters boolean not null default false,
  country text not null,
  region text,
  city text,
  street_address text,
  postal_address text,
  phone text,
  whatsapp text,
  email text,
  lat double precision,
  lng double precision,
  maps_url text,
  business_hours jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_office_locations_updated before update on office_locations
  for each row execute function set_updated_at();

-- ── company_contacts (key/value, admin can add new keys freely) ─────────
create table company_contacts (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  value text,
  type text not null default 'text', -- text | email | phone | whatsapp | url
  department text,
  public_visible boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_company_contacts_updated before update on company_contacts
  for each row execute function set_updated_at();

-- ── contact_messages ─────────────────────────────────────────────────────
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  subject text,
  enquiry_type text not null default 'general',
  message text not null,
  consent boolean not null default false,
  status contact_status not null default 'new',
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_contact_messages_updated before update on contact_messages
  for each row execute function set_updated_at();

-- ── partnership_enquiries ────────────────────────────────────────────────
create table partnership_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text,
  email text not null,
  phone text,
  country text,
  partnership_type text not null,
  message text,
  consent boolean not null default false,
  status partnership_status not null default 'new',
  internal_notes text,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_partnership_enquiries_updated before update on partnership_enquiries
  for each row execute function set_updated_at();

-- ── media (also serves as the document library via is_public) ──────────
create table media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_path text not null,
  bucket text not null default 'public-media',
  public_url text,
  mime_type text not null,
  size_bytes bigint not null default 0,
  alt_text text,
  is_public boolean not null default true,
  uploaded_by uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── legal_documents ──────────────────────────────────────────────────────
create table legal_documents (
  id uuid primary key default gen_random_uuid(),
  type legal_doc_type not null unique,
  title text not null,
  content text not null,
  version text not null default '1.0',
  effective_date date not null default current_date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_legal_documents_updated before update on legal_documents
  for each row execute function set_updated_at();

-- ── navigation_items ─────────────────────────────────────────────────────
create table navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  location nav_location not null default 'header',
  parent_id uuid references navigation_items(id) on delete cascade,
  is_external boolean not null default false,
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_navigation_items_updated before update on navigation_items
  for each row execute function set_updated_at();

-- ── site_settings (singleton) ────────────────────────────────────────────
create table site_settings (
  id integer primary key default 1,
  site_name text not null default 'Sikamine Gold Trading Ltd',
  logo_url text,
  dark_logo_url text,
  favicon_url text,
  primary_color text not null default '#05115D',
  secondary_color text not null default '#F9660E',
  accent_color text not null default '#C9A227',
  default_seo_image text,
  footer_copyright text not null default 'Sikamine Gold Trading Ltd. All Rights Reserved.',
  footer_description text not null default 'Structured, transparent and responsible gold trading built on governance and compliance.',
  social_links jsonb not null default '{}'::jsonb,
  analytics_id text,
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
create trigger trg_site_settings_updated before update on site_settings
  for each row execute function set_updated_at();
insert into site_settings (id) values (1);

-- ── seo_settings ─────────────────────────────────────────────────────────
create table seo_settings (
  id uuid primary key default gen_random_uuid(),
  route_key text not null unique,
  seo_title text,
  meta_description text,
  keywords text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  no_index boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_seo_settings_updated before update on seo_settings
  for each row execute function set_updated_at();

-- ── audit_logs ───────────────────────────────────────────────────────────
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admin_users(id) on delete set null,
  admin_name text,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);
create index idx_audit_logs_created on audit_logs(created_at desc);

-- ══════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════════════

alter table admin_users enable row level security;
alter table pages enable row level security;
alter table page_sections enable row level security;
alter table services enable row level security;
alter table pillars enable row level security;
alter table partner_categories enable row level security;
alter table office_locations enable row level security;
alter table company_contacts enable row level security;
alter table contact_messages enable row level security;
alter table partnership_enquiries enable row level security;
alter table media enable row level security;
alter table legal_documents enable row level security;
alter table navigation_items enable row level security;
alter table site_settings enable row level security;
alter table seo_settings enable row level security;
alter table audit_logs enable row level security;

-- admin_users: admins can see each other; only super_admin can write
create policy admin_users_select on admin_users for select
  using (is_admin());
create policy admin_users_insert on admin_users for insert
  with check (has_admin_role(array['super_admin']::admin_role[]));
create policy admin_users_update on admin_users for update
  using (has_admin_role(array['super_admin']::admin_role[]));
create policy admin_users_delete on admin_users for delete
  using (has_admin_role(array['super_admin']::admin_role[]));

-- generic public-read / admin-write pattern for content tables
create policy pages_public_select on pages for select using (published or is_admin());
create policy pages_admin_write on pages for all using (is_admin()) with check (is_admin());

create policy page_sections_public_select on page_sections for select
  using (visible or is_admin());
create policy page_sections_admin_write on page_sections for all
  using (is_admin()) with check (is_admin());

create policy services_public_select on services for select using (published or is_admin());
create policy services_admin_write on services for all using (is_admin()) with check (is_admin());

create policy pillars_public_select on pillars for select using (status = 'active' or is_admin());
create policy pillars_admin_write on pillars for all using (is_admin()) with check (is_admin());

create policy partner_categories_public_select on partner_categories for select
  using (status = 'active' or is_admin());
create policy partner_categories_admin_write on partner_categories for all
  using (is_admin()) with check (is_admin());

create policy office_locations_public_select on office_locations for select
  using (visible or is_admin());
create policy office_locations_admin_write on office_locations for all
  using (is_admin()) with check (is_admin());

create policy company_contacts_public_select on company_contacts for select
  using (public_visible or is_admin());
create policy company_contacts_admin_write on company_contacts for all
  using (is_admin()) with check (is_admin());

create policy legal_documents_public_select on legal_documents for select
  using (published or is_admin());
create policy legal_documents_admin_write on legal_documents for all
  using (is_admin()) with check (is_admin());

create policy navigation_items_public_select on navigation_items for select
  using (visible or is_admin());
create policy navigation_items_admin_write on navigation_items for all
  using (has_admin_role(array['super_admin', 'administrator']::admin_role[]))
  with check (has_admin_role(array['super_admin', 'administrator']::admin_role[]));

create policy site_settings_public_select on site_settings for select using (true);
create policy site_settings_admin_write on site_settings for update
  using (has_admin_role(array['super_admin', 'administrator']::admin_role[]))
  with check (has_admin_role(array['super_admin', 'administrator']::admin_role[]));

create policy seo_settings_public_select on seo_settings for select using (true);
create policy seo_settings_admin_write on seo_settings for all
  using (is_admin()) with check (is_admin());

create policy media_public_select on media for select using (is_public or is_admin());
create policy media_admin_write on media for all using (is_admin()) with check (is_admin());

-- contact_messages / partnership_enquiries: public can insert only; admins manage
create policy contact_messages_public_insert on contact_messages for insert
  to anon, authenticated with check (true);
create policy contact_messages_admin_select on contact_messages for select using (is_admin());
create policy contact_messages_admin_update on contact_messages for update
  using (is_admin()) with check (is_admin());
create policy contact_messages_admin_delete on contact_messages for delete using (is_admin());

create policy partnership_enquiries_public_insert on partnership_enquiries for insert
  to anon, authenticated with check (true);
create policy partnership_enquiries_admin_select on partnership_enquiries for select
  using (is_admin());
create policy partnership_enquiries_admin_update on partnership_enquiries for update
  using (is_admin()) with check (is_admin());
create policy partnership_enquiries_admin_delete on partnership_enquiries for delete
  using (is_admin());

-- audit_logs: administrator+ can read, inserts happen via server (authenticated admin)
create policy audit_logs_select on audit_logs for select
  using (has_admin_role(array['super_admin', 'administrator']::admin_role[]));
create policy audit_logs_insert on audit_logs for insert
  to authenticated with check (is_admin());

-- ══════════════════════════════════════════════════════════════════════
-- Storage
-- ══════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media', 'public-media', true, 26214400,
   array['image/jpeg','image/png','image/webp','image/svg+xml','image/gif','video/mp4','application/pdf']),
  ('private-documents', 'private-documents', false, 26214400,
   array['application/pdf','image/jpeg','image/png','application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

create policy "public-media read" on storage.objects for select
  using (bucket_id = 'public-media');
create policy "public-media admin write" on storage.objects for insert
  with check (bucket_id = 'public-media' and is_admin());
create policy "public-media admin update" on storage.objects for update
  using (bucket_id = 'public-media' and is_admin());
create policy "public-media admin delete" on storage.objects for delete
  using (bucket_id = 'public-media' and is_admin());

create policy "private-documents admin all" on storage.objects for all
  using (bucket_id = 'private-documents' and is_admin())
  with check (bucket_id = 'private-documents' and is_admin());
