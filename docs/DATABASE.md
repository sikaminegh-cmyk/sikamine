# Database

Sikamine's database is a standard PostgreSQL database managed by Supabase. It is fully exportable and portable — nothing about the schema locks Sikamine into Supabase specifically, and the raw SQL in `supabase/migrations/` can be applied to any PostgreSQL instance if the platform is ever migrated away from Supabase entirely.

## Schema Overview

All tables live in the `public` schema. See `supabase/migrations/0001_init.sql` for the authoritative, fully-commented definition (tables, enums, Row Level Security policies, storage buckets) and `0002_seed.sql` for the initial editable content.

| Table | Purpose |
|---|---|
| `admin_users` | Admin accounts, roles (`super_admin`, `administrator`, `editor`), status |
| `pages` / `page_sections` | Section-based content for every major public page |
| `services` | Gold Trading, Aggregator Funding, Compliance Advisory, Off-Take Partnerships, etc. |
| `pillars` | Company pillars shown on Home/About |
| `partner_categories` | Partner types shown on Home/Partnerships |
| `office_locations` | One or more office locations |
| `company_contacts` | Phone/email/address fields, including department contacts (CEO, Director, Compliance, etc.) |
| `contact_messages` | Public contact form submissions |
| `partnership_enquiries` | Public partnership enquiry form submissions |
| `media` | Uploaded files (images/video/documents); `is_public` controls visibility and which storage bucket is used |
| `legal_documents` | Terms, Privacy, Cookies (and optionally Disclaimer / Responsible Sourcing Policy), versioned |
| `navigation_items` | Header/footer navigation |
| `site_settings` | Singleton row: branding, colours, footer, social links, analytics ID, maintenance mode |
| `seo_settings` | Per-route SEO metadata |
| `audit_logs` | Record of admin logins and content changes |

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
   This applies `0001_init.sql` and `0002_seed.sql` to the production database.
3. In the Supabase dashboard, copy the Project URL, `anon` key and `service_role` key into your hosting provider's environment variables (never commit these — see `.env.example`).
4. Run `node scripts/create-admin.mjs` **once**, pointed at the production project (via `.env.local` or exported env vars), to create the first Super Admin. After that, all further admins are created from `/admin/admins` inside the app — there is no public registration route.
5. Confirm the storage buckets `public-media` and `private-documents` were created by the migration (Storage tab in the dashboard).

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
