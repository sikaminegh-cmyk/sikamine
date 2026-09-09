# Client Handover — Ownership & Transfer Checklist

Sikamine Gold Trading Ltd owns this platform outright. This document lists everything required for Sikamine to independently manage, modify, migrate or transfer the website after project completion, with no dependency on the original development team.

## What Sikamine Receives

1. **Complete source code** — this repository, including full git history.
2. **Production database ownership** — a Supabase project created in Sikamine's name (see `docs/DATABASE.md`).
3. **Database schema & seed data** — `supabase/migrations/*.sql`, human-readable SQL, portable to any Postgres host.
4. **Database backup** — see `docs/DATABASE.md` → Backup & Export.
5. **Storage ownership** — media/documents live in Sikamine's own Supabase Storage buckets (`public-media`, `private-documents`).
6. **Hosting access** — a Vercel account/team or VPS in Sikamine's name (see `docs/DEPLOYMENT.md`).
7. **Domain/DNS access** — registered in Sikamine's name.
8. **Deployment documentation** — `docs/DEPLOYMENT.md`.
9. **Environment variable template** — `.env.example`, with production values documented separately (not committed to source control).
10. **SMTP configuration instructions** — `docs/DEPLOYMENT.md` § 3.
11. **Super Admin account** — created via `scripts/create-admin.mjs` directly on the production database; the developer does not retain a copy of this password.
12. **Build & maintenance instructions** — `README.md`.
13. **Backup instructions** — `docs/DATABASE.md`.
14. **Technical architecture overview** — `README.md` § Stack/Project Structure.
15. **Third-party service list & recurring costs** — `docs/DEPLOYMENT.md` § 7.

## No-Lock-In Confirmation

- ✅ No proprietary CMS — content lives in a standard Postgres database Sikamine owns.
- ✅ No hidden developer administrator account. The only admin accounts are the ones created via `scripts/create-admin.mjs` or invited from `/admin/admins` by a Super Admin — both fully visible and manageable from `/admin/admins`.
- ✅ No remote kill switch. There is no code path that lets the developer disable, lock, or brick the site remotely; `maintenance_mode` is a plain database flag any Administrator/Super Admin can toggle from `/admin/settings`.
- ✅ No developer-owned API keys required at runtime. All required keys (Supabase, SMTP) belong to Sikamine and are supplied via environment variables.
- ✅ Sikamine can add or remove admins, change every admin's role, and deactivate any account (including, eventually, the original Super Admin) without developer involvement.
- ✅ Sikamine can export the full database, all uploaded media, and all enquiry data at any time (`docs/DATABASE.md`).
- ✅ Sikamine can move hosting providers by redeploying this same codebase elsewhere — no Vercel-specific or host-specific code paths are used beyond standard Next.js.
- ✅ Sikamine can independently hire a different developer at any time; this repository and the docs in this folder are sufficient for a new developer to pick up the project without contacting the original team.

## Verifying Independent Control

Before considering handover complete, confirm Sikamine (not the developer) can, unassisted:

- [ ] Log in to `/admin` as Super Admin
- [ ] Change the logo (Site Settings)
- [ ] Change contact information / address (Company Contacts)
- [ ] Add another office (Offices)
- [ ] Set the CEO/MD and Director email addresses once the corporate domain exists (Company Contacts)
- [ ] Add corporate email addresses for new departments (Company Contacts → Add Custom Contact)
- [ ] Change a service's description (Services)
- [ ] Edit homepage content (Pages → Home)
- [ ] Change compliance/regulatory wording (Pages → Governance & Compliance)
- [ ] Edit Terms & Conditions and republish (Legal Documents)
- [ ] Upload a document/image (Media Library)
- [ ] Replace an image used on the site (Media Library + relevant Page section)
- [ ] Add and remove an administrator (Admin Users)
- [ ] Change SEO title/description for a page (SEO)
- [ ] View and export enquiries (Contact Messages / Partnership Enquiries)
- [ ] Log in to the Supabase dashboard directly and view the database
- [ ] Log in to the hosting provider dashboard directly and view the deployment
- [ ] Access the domain registrar account directly

Once every item above is checked by someone at Sikamine (not the developer), Sikamine has full, independent, unrestricted control of the platform.
