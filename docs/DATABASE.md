# Database

Sikamine's database is a standard PostgreSQL database managed by Supabase. It is fully exportable and portable — nothing about the schema locks Sikamine into Supabase specifically, and the raw SQL in `supabase/migrations/` can be applied to any PostgreSQL instance if the platform is ever migrated away from Supabase entirely.

## Schema Overview

All tables live in the `public` schema. The schema is built up across `supabase/migrations/0001_init.sql` through `0008_blog_albums.sql`, applied in order — each file is small and individually commented; there is no single "authoritative" file anymore, `supabase db push` (or local auto-apply) runs all of them in sequence.

| Table | Purpose | Added in |
|---|---|---|
| `admin_users` | Admin accounts, roles (`super_admin`, `administrator`, `editor`), status | 0001 |
| `pages` / `page_sections` | Section-based content for every major public page | 0001 |
| `services` | Gold Trading, Aggregator Funding, Compliance Advisory, Off-Take Partnerships, etc. | 0001 |
| `pillars` | Company pillars shown on Home/About | 0001 |
| `partner_categories` | Partner types shown on Home/Partnerships | 0001 |
| `office_locations` | One or more office locations | 0001 |
| `company_contacts` | Phone/email/address fields, including department contacts (CEO, Director, Compliance, etc.) | 0001, split further in 0006 |
| `contact_messages` | Public contact form submissions | 0001 |
| `partnership_enquiries` | Public partnership enquiry form submissions | 0001 |
| `media` | Uploaded files (images/video/documents); `is_public` controls visibility and which storage bucket is used | 0001 |
| `legal_documents` | Terms, Privacy, Cookies (and optionally Disclaimer / Responsible Sourcing Policy), versioned | 0001 |
| `navigation_items` | Header/footer navigation; `group_key` optionally splits the footer into sub-columns (e.g. the "Other Links" group) | 0001, `group_key` added in 0008 |
| `site_settings` | Singleton row: branding, colours, footer, social links, analytics ID, maintenance mode | 0001 |
| `seo_settings` | Per-route SEO metadata | 0001 |
| `audit_logs` | Record of admin logins and content changes | 0001 |
| `partner_logos` | Banking partner / regulator / partner logos shown in the homepage carousel | 0003 |
| `team_members` | Leadership team shown on the About page | 0005 |
| `blog_posts` | Blog articles (`/blog`) | 0008 |
| `albums` / `album_images` | Photo albums (`/albums`) and the photos within each | 0008 |

Row Level Security is enabled on every table. Public (anonymous) visitors can only read published/visible rows and insert into `contact_messages`/`partnership_enquiries`; all writes require an authenticated, active admin row. `site_settings` and `navigation_items` additionally require the `administrator` or `super_admin` role; `admin_users` and `audit_logs` require `super_admin`/`administrator`.

## Local Setup

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and Docker.
2. From the project root: `supabase start`. This provisions local Postgres/Auth/Storage/Mailpit and **automatically applies every file in `supabase/migrations/`** in order — no manual `db push` needed for local dev.
3. Copy the printed `API URL`, `anon key` and `service_role key` into `.env.local` (see `.env.example`).
4. Run `node scripts/create-admin.mjs "you@example.com" "password" "Your Name" super_admin` to create the first admin.

## Production Setup (Sikamine-owned Supabase project)

1. Create a project at [supabase.com](https://supabase.com) **using Sikamine's own account/email** — not a developer's personal account. This is required per the ownership requirement: Sikamine must be able to manage billing, transfer ownership, and revoke any collaborator access independently.
2. Install the Supabase CLI locally, then:
   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   This applies every file in `supabase/migrations/` (schema, RLS policies, storage buckets, and the seed content from `0002_seed.sql`) to the production database, in order.
3. In the Supabase dashboard, copy the Project URL, `anon` key and `service_role` key into your hosting provider's environment variables (never commit these — see `.env.example`).
4. Run `node scripts/create-admin.mjs` **once**, pointed at the production project (via `.env.local` or exported env vars), to create the first Super Admin. After that, all further admins are created from `/admin/admins` inside the app — there is no public registration route.
5. Confirm the storage buckets `public-media` and `private-documents` were created by the migration (Storage tab in the dashboard).

## Migrating Already-Configured Local Content to Production

If content has already been edited locally (branding, hero images, the CEO message, team members, office details, etc.) before the production project existed, don't re-type it all through the admin UI — copy the data over instead:

1. Push the schema to the new production project first (steps 1–2 above), so the tables/columns/policies exist before any data lands.
2. Dump **data only** from the local dev stack (the local Supabase CLI project, not production):
   ```bash
   supabase db dump --local --data-only -f local-data.sql
   ```
3. Apply it to the production database — get the connection string from the Supabase dashboard → Project Settings → Database → Connection string (URI, use the "pooler" one for `psql`):
   ```bash
   psql "<production-connection-string>" -f local-data.sql
   ```
   Two things in the output here are expected, not signs of a broken import:
   - The `admin_users` row(s) will fail to insert (a foreign key error referencing `auth.users`) — local dev admin accounts don't exist in production's separate Auth store. That's fine: "Production Setup" step 4 above (create the first Super Admin) creates the real production admin row correctly on its own.
   - `contact_messages`, `partnership_enquiries` and `audit_logs` will carry over whatever test rows exist locally (e.g. anything submitted while testing the contact form, or admin actions from development). These aren't harmful, but they're not real enquiries either — delete the test ones from `/admin/messages` and `/admin/partnership-enquiries` after go-live so the inbox starts clean; `audit_logs` can just be left, it's only an internal history log.
4. **Fix image URLs — this step is easy to miss.** Locally, uploaded image URLs are stored as *relative* paths (e.g. `/storage/v1/object/public/public-media/172...-logo.png`) — a dev-only convenience (see `lib/public-url.ts` and the `rewrites()` block in `next.config.ts`) that lets a local preview work behind a tunnel. That convenience does **not** exist in production, so those same relative paths will 404 once this data lands on the real site. Two ways to fix it:
   - **Re-upload through the admin UI (recommended, and usually faster for the small number of images involved)** — once the production Super Admin account exists, open the production `/admin`, and re-upload the logo, favicon, CEO photo, team member photos, and partner logos through their existing upload fields (Site Settings, the CEO Message page section, Team Members, Partner & Regulator Logos). Each upload automatically saves the correct absolute production URL — no SQL needed. (The six page-hero images are **not** part of this — they're static files already committed at `public/images/hero/*.jpg` and ship with the code.)
   - **Or fix it in SQL**, prepending the production Storage URL to every affected column in one pass:
     ```sql
     -- Run against the PRODUCTION database, after importing local-data.sql.
     -- Replace <project-ref> with the production Supabase project ref.
     update site_settings set
       logo_url = case when logo_url like '/storage/%' then 'https://<project-ref>.supabase.co' || logo_url else logo_url end,
       dark_logo_url = case when dark_logo_url like '/storage/%' then 'https://<project-ref>.supabase.co' || dark_logo_url else dark_logo_url end,
       favicon_url = case when favicon_url like '/storage/%' then 'https://<project-ref>.supabase.co' || favicon_url else favicon_url end,
       default_seo_image = case when default_seo_image like '/storage/%' then 'https://<project-ref>.supabase.co' || default_seo_image else default_seo_image end;
     update page_sections set image_url = 'https://<project-ref>.supabase.co' || image_url where image_url like '/storage/%';
     update media set public_url = 'https://<project-ref>.supabase.co' || public_url where public_url like '/storage/%';
     update partner_logos set logo_url = 'https://<project-ref>.supabase.co' || logo_url where logo_url like '/storage/%';
     update team_members set photo_url = 'https://<project-ref>.supabase.co' || photo_url where photo_url like '/storage/%';
     update blog_posts set cover_image_url = 'https://<project-ref>.supabase.co' || cover_image_url where cover_image_url like '/storage/%';
     update albums set cover_image_url = 'https://<project-ref>.supabase.co' || cover_image_url where cover_image_url like '/storage/%';
     update album_images set image_url = 'https://<project-ref>.supabase.co' || image_url where image_url like '/storage/%';
     ```
     Note this only fixes the *database rows* — the actual image files still need to be copied from the local Storage bucket to the production one (Supabase dashboard → Storage → download from local Studio, upload to the production project's `public-media` bucket, keeping the same file path). The re-upload approach above avoids this entirely, which is why it's the easier default for a small number of images.
5. Spot-check the production site once deployed: homepage logo, About page CEO photo and hero images, Team Members photos, and the partner logo carousel are the places a missed image URL would show up as broken.

## Adding / Managing Admins

- **First admin ever:** `node scripts/create-admin.mjs <email> <password> "Full Name" super_admin` (service-role key required — keep this script and the key safe).
- **Every subsequent admin:** log in as a Super Admin → `/admin/admins` → Invite Admin. This uses Supabase's built-in invite-by-email flow; the invitee sets their own password via the emailed link. No password is ever visible to or set by another admin.
- **Deactivating an admin:** `/admin/admins` → Deactivate. This is reversible (Reactivate) and does not delete their audit history.

## Backup & Export

Sikamine owns this data outright and can export it at any time, independent of this development team:

- **Full database backup:** Supabase dashboard → Database → Backups (automatic daily backups on paid plans), or manually:
  ```bash
  supabase db dump -f backup.sql   # schema + data, from a linked project
  ```
- **Enquiries (CSV):** `/admin/messages` and `/admin/partnership-enquiries` both have an **Export CSV** button that downloads the currently filtered list.
- **Media files:** Supabase dashboard → Storage → download individual files or use the [Supabase CLI storage commands](https://supabase.com/docs/guides/cli/storage) to sync a whole bucket locally.
- **Restore:** `psql <connection-string> -f backup.sql` against a fresh Supabase (or any Postgres) instance, or use `supabase db reset` locally against `backup.sql`.

## Updating the Schema

If the schema changes in the future, add a new file to `supabase/migrations/` (e.g. `0003_add_x.sql`) rather than editing existing migration files, and run `supabase db push`. Update `lib/types/database.ts` to match — see the comment at the top of that file for why it is hand-written rather than tool-generated (a known upstream TypeScript inference issue in the current `@supabase/supabase-js` release means the Supabase client is intentionally created without the `Database` generic; the interfaces in that file are still the source of truth and are cast onto query results at the point of use in `lib/data/*.ts` and `lib/actions/**/*.ts`).
