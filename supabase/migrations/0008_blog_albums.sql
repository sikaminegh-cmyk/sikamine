-- Blog posts + photo albums, and a footer "Other Links" group.

-- ── blog_posts ───────────────────────────────────────────────────────────
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  seo_title text,
  seo_description text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_blog_posts_updated before update on blog_posts
  for each row execute function set_updated_at();
create index idx_blog_posts_published on blog_posts(published, published_at desc);

-- ── albums + album_images ────────────────────────────────────────────────
create table albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_albums_updated before update on albums
  for each row execute function set_updated_at();

create table album_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  image_url text not null,
  caption text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_album_images_album on album_images(album_id, position);

alter table blog_posts enable row level security;
alter table albums enable row level security;
alter table album_images enable row level security;

create policy blog_posts_public_select on blog_posts for select using (published or is_admin());
create policy blog_posts_admin_write on blog_posts for all using (is_admin()) with check (is_admin());

create policy albums_public_select on albums for select using (published or is_admin());
create policy albums_admin_write on albums for all using (is_admin()) with check (is_admin());

create policy album_images_public_select on album_images for select
  using (exists (select 1 from albums a where a.id = album_id and (a.published or is_admin())));
create policy album_images_admin_write on album_images for all using (is_admin()) with check (is_admin());

-- ── footer "Other Links" group ──────────────────────────────────────────
-- navigation_items.location stays a plain header/footer split; group_key is
-- an optional sub-grouping used only by the footer today (null = the main
-- footer nav column, 'other' = the separate "Other Links" column).
alter table navigation_items add column group_key text;

insert into navigation_items (label, url, location, group_key, is_external, position, visible) values
  ('Bullion Vault Gold Price', 'https://www.bullionvault.com/gold-price-chart.do', 'footer', 'other', true, 0, true),
  ('LBMA Gold Price', 'https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices', 'footer', 'other', true, 1, true),
  ('TradingView Gold Price', 'https://www.tradingview.com/symbols/XAUUSD/', 'footer', 'other', true, 2, true);

insert into navigation_items (label, url, location, is_external, position, visible)
select 'Blog', '/blog', 'header', false, coalesce((select max(position) + 1 from navigation_items where location = 'header'), 0), true;

insert into navigation_items (label, url, location, is_external, position, visible)
select 'Albums', '/albums', 'header', false, coalesce((select max(position) + 1 from navigation_items where location = 'header'), 0), true;
