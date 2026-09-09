# Sikamine Gold Trading Ltd — Website & CMS

Corporate website and content management platform for Sikamine Gold Trading Ltd. Built with Next.js, TypeScript, Tailwind CSS and Supabase (Postgres, Auth, Storage) so the entire platform — code, database, storage and hosting — belongs to and is fully controllable by Sikamine.

## Stack

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS v4
- **Database / Auth / Storage:** Supabase
- **Email:** Nodemailer against a Sikamine-owned SMTP mailbox (Hostinger or any provider)
- **Rich text:** Tiptap (admin content editing)

## Project Structure

```
app/(public)/     Public website pages (content-driven — see below)
app/admin/        Admin dashboard (auth-gated CMS)
components/       UI components (public/ and admin/)
lib/               Data access, server actions, validation, Supabase clients
supabase/          Database migrations + seed data
docs/              Deployment, database and handover documentation
scripts/           Admin bootstrap script
```

Almost nothing on the public site is hardcoded — homepage/about/services/governance/responsible-sourcing/partnerships/contact copy, services, pillars, partner categories, offices, company contact details, legal documents, navigation and SEO metadata are all stored in the database and editable from `/admin`.

## Local Development

1. Install dependencies: `npm install`
2. Set up Supabase — either:
   - **Local (recommended for development):** install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run `supabase start` (requires Docker). This applies the migrations in `supabase/migrations/` automatically and prints local API/DB URLs and keys.
   - **Hosted:** create a project at [supabase.com](https://supabase.com) and run the migrations with `supabase link` + `supabase db push` (see `docs/DATABASE.md`).
3. Copy `.env.example` to `.env.local` and fill in the values (Supabase URL/keys from step 2; SMTP is optional locally — emails just log to the console if unset, or point `SMTP_HOST`/`SMTP_PORT` at the local Supabase Mailpit catcher printed by `supabase start`).
4. Create the first Super Admin: `node scripts/create-admin.mjs "you@example.com" "a-strong-password" "Your Name" super_admin`
5. `npm run dev` and open `http://localhost:3000`. Admin dashboard is at `/admin/login`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — ESLint
- `npx tsc --noEmit` — TypeScript check
- `node scripts/create-admin.mjs <email> <password> <full name> [role]` — create or promote an admin (see `docs/DATABASE.md`)

## Documentation

- [`docs/DATABASE.md`](docs/DATABASE.md) — schema, migrations, backup/restore, adding admins
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — production deployment, domain, SMTP, environment variables
- [`docs/HANDOVER.md`](docs/HANDOVER.md) — account ownership checklist and what Sikamine needs to fully control the platform

## Scope Note (Phase 1 / Phase 2)

This build ships a fully working core: public site, auth, and the admin modules that map to editable public content (pages/sections, services, pillars, partner categories, offices, company contacts, contact/partnership inboxes, media library, legal documents, SEO, navigation, site settings, admin users, audit log). A first-party analytics dashboard, a standalone document-library UI (the Media Library's public/private flag already covers document visibility), and site-wide search are deferred — see the plan history for details. Google Analytics can be wired in immediately via Site Settings.
