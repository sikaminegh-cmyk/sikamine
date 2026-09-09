# Deployment

## Principle

Every account used in production — hosting, Supabase, domain/DNS, SMTP, analytics — should be created **in Sikamine's own name**, with the developer added only as a temporary collaborator during setup and removed afterwards. This guide is written for that ownership model.

## 1. Domain & DNS

Register (or use an existing) domain in Sikamine's name with a registrar of Sikamine's choice. Point it at the hosting provider chosen below once deployment is live.

## 2. Supabase (Database, Auth, Storage)

Follow `docs/DATABASE.md` → "Production Setup" to create a Sikamine-owned Supabase project and push the schema.

## 3. SMTP (Email)

Create a mailbox on a provider Sikamine controls — e.g. Hostinger, Google Workspace, or any SMTP provider — for sending contact/partnership acknowledgement and notification emails. You need:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (`true` for port 465, `false` for 587/25 with STARTTLS)
- `SMTP_USER`, `SMTP_PASSWORD`
- `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`

This is independent of Supabase Auth's own email sending (used for admin invites) — configure the Auth SMTP separately in the Supabase dashboard under Project Settings → Auth → SMTP Settings if the default Supabase-managed sender's rate limits are too low for production admin invite volume.

## 4. Hosting

Any Node.js host that supports Next.js works. Two common options:

### Option A — Vercel (simplest)

1. Create a Vercel account in Sikamine's name (or add the project to an existing Sikamine Vercel team).
2. Import this repository.
3. Add all variables from `.env.example` under Project Settings → Environment Variables (production values — the Sikamine Supabase project and SMTP mailbox from steps 2–3).
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain.
5. Deploy, then attach the custom domain under Project Settings → Domains and update DNS as instructed.

### Option B — Self-hosted / VPS

1. `npm ci && npm run build && npm run start` (or run behind a process manager like PM2, and a reverse proxy such as Nginx or Caddy terminating TLS).
2. Set the same environment variables via your process manager or a `.env.production` file loaded by the platform.
3. Ensure Node.js 20+ is installed on the server.

## 5. Environment Variables

See `.env.example` for the full list. In short:

| Variable | Exposed to browser? | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Safe to expose — RLS enforces access control |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Safe to expose — RLS enforces access control |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Server-only. Bypasses RLS. Never put in `NEXT_PUBLIC_*` or commit it |
| `SMTP_*` | **No** | Server-only |
| `NEXT_PUBLIC_SITE_URL` | Yes | Used for metadata, sitemap, OG tags |

## 6. Post-Deploy Checklist

- [ ] Visit `/admin/login` and sign in with the Super Admin created via `scripts/create-admin.mjs`
- [ ] Site Settings → upload the real logo/favicon, set brand colours if different from defaults
- [ ] Company Contacts → fill in `info_email`, `ceo_email`, `director_email`, etc. once the corporate domain's mailboxes exist, and toggle them Public as appropriate
- [ ] Offices → confirm the Ghana Headquarters details and add any additional offices
- [ ] Legal Documents → review Terms/Privacy/Cookies content and confirm Published
- [ ] SEO → review/adjust per-page metadata
- [ ] Submit a test enquiry through the public Contact form and confirm the email notification arrives
- [ ] Confirm `robots.txt` and `sitemap.xml` resolve at the production domain
- [ ] Turn **off** maintenance mode if it was enabled during setup

## 7. Recurring Third-Party Costs

| Service | Typical cost driver |
|---|---|
| Domain registration | Annual renewal |
| Supabase | Free tier covers light traffic; paid plan needed for daily backups, higher storage/bandwidth |
| Hosting (Vercel or VPS) | Free/hobby tier for low traffic; paid plan for production SLAs |
| SMTP mailbox | Whatever the mail provider charges (e.g. Hostinger email plan) |
| Google Analytics | Free — optional, configured via Site Settings |

None of these are billed to or owned by the development team once handover is complete.
