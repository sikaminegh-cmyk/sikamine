-- Contact page: combine the office info and the message form into a single
-- two-column section instead of two stacked full-width sections.

update page_sections
set type = 'contact_split', background_style = 'light'
where page_id = (select id from pages where slug = 'contact') and type = 'offices_grid';

delete from page_sections
where page_id = (select id from pages where slug = 'contact') and type = 'contact_form';
