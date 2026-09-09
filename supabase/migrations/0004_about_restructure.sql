-- About page: shorter hero, Mission/Vision/Values as a responsive card grid,
-- and a new admin-editable CEO message section.

-- Shorten the About hero.
update page_sections
set type = 'hero_compact'
where type = 'hero'
  and page_id = (select id from pages where slug = 'about');

-- Mission / Vision / Values become a grouped card grid (consecutive
-- `value_card` sections are rendered together — see SectionRenderer).
-- Give them a shared background and consecutive positions (2, 3, 4).
update page_sections
set type = 'value_card', background_style = 'alt', position = 2
where page_id = (select id from pages where slug = 'about') and title = 'Mission';

update page_sections
set type = 'value_card', background_style = 'alt', position = 3
where page_id = (select id from pages where slug = 'about') and title = 'Vision';

update page_sections
set type = 'value_card', background_style = 'alt', position = 4
where page_id = (select id from pages where slug = 'about') and title = 'Values';

-- Shift everything from "Operational Philosophy" onward down by one slot to
-- make room for the CEO message section at position 5.
update page_sections
set position = position + 1
where page_id = (select id from pages where slug = 'about') and position >= 5;

insert into page_sections (page_id, type, title, subtitle, body, image_url, background_style, position, visible)
select id, 'ceo_message',
  'A Message From the Chief Executive Officer',
  'Chief Executive Officer',
  $$<p>At Sikamine Gold Trading Ltd, we believe that the future of Ghana's gold industry lies in building a more responsible, transparent and professionally managed value chain.</p>
<p>Sikamine was established with a clear purpose: to participate meaningfully in Ghana's regulated gold value chain by connecting gold producers and approved suppliers with reliable downstream markets through disciplined, transparent and responsible trading practices.</p>
<p>Our approach is built on these principles — Trust, Transparency and Value. We believe that every transaction should be properly documented, every business relationship should be built on integrity, and every partner should see genuine value from working with us.</p>
<p>As we grow, our ambition extends beyond gold trading. We are developing the capabilities, systems and partnerships necessary to participate across the gold value chain, including responsible gold sourcing, aggregation, mining, processing and trading. We are committed to achieving this growth responsibly, with strong governance, sound financial management, environmental stewardship and meaningful engagement with the communities in which we operate.</p>
<p>Our journey is still at an early stage, but our vision is long-term. We are building a Ghanaian company that can earn the confidence of suppliers, investors, business partners and communities while contributing to the development of a stronger and more transparent gold industry.</p>
<p>To our partners, investors, suppliers and stakeholders, thank you for believing in our vision and joining us on this journey.</p>
<p>Together, we are building value. Together, we are creating wealth and making impact.</p>$$,
  null, 'light', 5, true
from pages where slug = 'about';
