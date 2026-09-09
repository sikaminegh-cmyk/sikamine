-- Point each page's hero section at a static file in /public/images/hero/
-- instead of an uploaded Supabase Storage file. Admins can still replace
-- these later via the Page Sections editor's Image upload — this just sets
-- sensible defaults that resolve as soon as the client drops matching files
-- into the public folder (see docs/DATABASE.md for the filenames).

update page_sections set image_url = '/images/hero/about.jpg'
where type = 'hero_compact' and page_id = (select id from pages where slug = 'about');

update page_sections set image_url = '/images/hero/governance-compliance.jpg'
where type = 'hero' and page_id = (select id from pages where slug = 'governance-compliance');

update page_sections set image_url = '/images/hero/responsible-sourcing.jpg'
where type = 'hero' and page_id = (select id from pages where slug = 'responsible-sourcing');

update page_sections set image_url = '/images/hero/partnerships.jpg'
where type = 'hero' and page_id = (select id from pages where slug = 'partnerships');

update page_sections set image_url = '/images/hero/contact.jpg'
where type = 'hero' and page_id = (select id from pages where slug = 'contact');
