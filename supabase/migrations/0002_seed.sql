-- Initial editable content, seeded so every admin module has something to
-- manage from day one. All of this is editable in /admin afterwards —
-- nothing here is hardcoded into the frontend.

-- ── navigation ───────────────────────────────────────────────────────────
insert into navigation_items (label, url, location, is_external, position, visible) values
  ('Home', '/', 'header', false, 0, true),
  ('About', '/about', 'header', false, 1, true),
  ('Services', '/services', 'header', false, 2, true),
  ('Governance & Compliance', '/governance-compliance', 'header', false, 3, true),
  ('Partnerships', '/partnerships', 'header', false, 4, true),
  ('Responsible Sourcing', '/responsible-sourcing', 'header', false, 5, true),
  ('Contact', '/contact', 'header', false, 6, true),
  ('About', '/about', 'footer', false, 0, true),
  ('Services', '/services', 'footer', false, 1, true),
  ('Governance & Compliance', '/governance-compliance', 'footer', false, 2, true),
  ('Responsible Sourcing', '/responsible-sourcing', 'footer', false, 3, true),
  ('Partnerships', '/partnerships', 'footer', false, 4, true),
  ('Contact', '/contact', 'footer', false, 5, true),
  ('Terms & Conditions', '/terms', 'footer', false, 6, true),
  ('Privacy Policy', '/privacy', 'footer', false, 7, true),
  ('Cookie Policy', '/cookies', 'footer', false, 8, true);

-- ── company contacts ─────────────────────────────────────────────────────
insert into company_contacts (key, label, value, type, department, public_visible, position) values
  ('phone', 'Telephone', '+233 208 794 176', 'phone', 'General', true, 0),
  ('secondary_phone', 'Secondary Phone', null, 'phone', 'General', false, 1),
  ('whatsapp', 'WhatsApp', null, 'whatsapp', 'General', false, 2),
  ('general_email', 'General Enquiries', 'sikaminegh@gmail.com', 'email', 'General', true, 3),
  ('info_email', 'Info', null, 'email', 'General', false, 4),
  ('ceo_email', 'CEO / Managing Director', null, 'email', 'Leadership', false, 5),
  ('director_email', 'Director', null, 'email', 'Leadership', false, 6),
  ('compliance_email', 'Compliance', null, 'email', 'Compliance', false, 7),
  ('partnerships_email', 'Partnerships', null, 'email', 'Partnerships', false, 8),
  ('finance_email', 'Finance', null, 'email', 'Finance', false, 9),
  ('operations_email', 'Operations', null, 'email', 'Operations', false, 10),
  ('postal_address', 'Postal Address', 'P.O. Box KS 557, Accra, Ghana, WA', 'text', 'General', true, 11),
  ('physical_address', 'Physical Address', 'Kasoa / Accra, Ghana', 'text', 'General', true, 12),
  ('maps_url', 'Google Maps URL', null, 'url', 'General', false, 13);

-- ── office locations ─────────────────────────────────────────────────────
insert into office_locations
  (title, is_headquarters, country, region, city, street_address, postal_address, phone, email, business_hours, visible, position)
values
  ('Ghana Headquarters', true, 'Ghana', 'Greater Accra', 'Kasoa / Accra',
   null, 'P.O. Box KS 557, Accra, Ghana, WA', '+233 208 794 176', 'sikaminegh@gmail.com',
   '{"mon_fri": "8:00 AM - 5:00 PM", "sat": "By appointment", "sun": "Closed"}'::jsonb,
   true, 0);

-- ── services ─────────────────────────────────────────────────────────────
insert into services (name, slug, short_description, full_description, icon, published, position) values
(
  'Gold Trading', 'gold-trading',
  'Purchase and sale of gold sourced from licensed miners through structured and compliant trade processes.',
  $$<p>Sikamine sources gold directly from appropriately licensed miners and suppliers, applying structured purchase arrangements and documentation at every stage.</p>
<p>Our gold trading process is built around traceability and buyer confidence:</p>
<ul>
<li>Supplier sourcing from licensed and verified miners</li>
<li>Structured purchase arrangements with clear documentation</li>
<li>Established relationships with verified buyers</li>
<li>Transaction and source documentation maintained for every trade</li>
<li>Traceable, auditable distribution to buyers and off-takers</li>
</ul>$$,
  'Coins', true, 0
),
(
  'Aggregator Funding', 'aggregator-funding',
  'Structured trade capital arrangements supporting verified buyers and suppliers across approved trade cycles.',
  $$<p>Sikamine provides structured trade capital arrangements to support qualified buyers and suppliers across defined, approved trade cycles.</p>
<p>These arrangements are structured trade capital facilities, not investment products:</p>
<ul>
<li>Capital is intended for defined gold sourcing and trading operations only</li>
<li>Terms, fees and any profit-sharing arrangements are set out in written agreements between the relevant parties</li>
<li>Funds are managed through approved company processes with appropriate documentation and record keeping</li>
</ul>
<p><strong>Risk disclosure:</strong> Gold trading involves commercial, operational, regulatory and market risks. Sikamine does not offer guaranteed returns, and participation in any trade capital arrangement is subject to the terms of the relevant written agreement. Prospective partners should seek independent professional advice before entering into an arrangement.</p>$$,
  'Landmark', true, 1
),
(
  'Compliance Advisory', 'compliance-advisory',
  'Guidance relating to governance, responsible sourcing and applicable Ghanaian gold trade regulatory requirements.',
  $$<p>Sikamine structures its own operations, and advises partners, around sound governance, documentation and responsible sourcing practice.</p>
<ul>
<li>Operational governance and internal controls</li>
<li>Documentation standards for sourcing and trade</li>
<li>Responsible sourcing procedures and supplier verification</li>
<li>General awareness of applicable Ghanaian regulatory requirements</li>
</ul>
<p>This advisory service relates to operational governance and compliance practice. It does not constitute legal advice, and Sikamine is not a law firm.</p>$$,
  'ShieldCheck', true, 2
),
(
  'Off-Take Partnerships', 'off-take-partnerships',
  'Structured gold supply relationships with verified buyers and qualified off-takers under agreed contractual terms.',
  $$<p>Sikamine builds long-term commercial relationships with verified buyers and qualified off-takers under clearly defined contractual terms.</p>
<ul>
<li>Verified buyer and off-taker qualification</li>
<li>Structured supply contracts with defined volumes and terms</li>
<li>Agreed documentation and delivery processes</li>
<li>Ongoing compliance checks throughout the relationship</li>
</ul>$$,
  'Handshake', true, 3
);

-- ── pillars ──────────────────────────────────────────────────────────────
insert into pillars (name, number, description, icon, position, status) values
  ('Governance First', '01', 'Every decision is measured against our governance standards.', 'Gavel', 0, 'active'),
  ('Compliance Driven', '02', 'Operations are structured around applicable national regulatory requirements.', 'FileCheck', 1, 'active'),
  ('Responsible Sourcing', '03', 'Ethical and traceable sourcing from appropriately licensed miners and suppliers.', 'Leaf', 2, 'active'),
  ('Zero Tolerance Policy', '04', 'No compromise on operational integrity or compliance.', 'ShieldAlert', 3, 'active');

-- ── partner categories ───────────────────────────────────────────────────
insert into partner_categories (name, description, icon, position, status) values
  ('Licensed Miners', 'Appropriately licensed mining operations supplying gold under verified arrangements.', 'Pickaxe', 0, 'active'),
  ('Gold Suppliers', 'Verified suppliers operating within Sikamine''s sourcing and documentation standards.', 'Package', 1, 'active'),
  ('Verified Buyers', 'Buyers who meet Sikamine''s eligibility and compliance requirements.', 'BadgeCheck', 2, 'active'),
  ('Off-Takers', 'Qualified off-takers engaged under structured, long-term supply contracts.', 'Truck', 3, 'active'),
  ('Institutional Partners', 'Institutions aligned with Sikamine''s governance and compliance standards.', 'Building2', 4, 'active'),
  ('Strategic Partners', 'Organisations collaborating with Sikamine on shared trade and compliance objectives.', 'Handshake', 5, 'active'),
  ('Potential Investors', 'Investors interested in Sikamine''s structured, governance-led approach to gold trading.', 'TrendingUp', 6, 'active');

-- ── pages ────────────────────────────────────────────────────────────────
insert into pages (slug, title, published) values
  ('home', 'Home', true),
  ('about', 'About Sikamine', true),
  ('governance-compliance', 'Governance & Compliance', true),
  ('responsible-sourcing', 'Responsible Sourcing', true),
  ('partnerships', 'Partnerships', true),
  ('contact', 'Contact', true);

-- ── home sections ────────────────────────────────────────────────────────
insert into page_sections (page_id, type, title, subtitle, body, cta_label, cta_url, secondary_cta_label, secondary_cta_url, background_style, position, visible)
select id, 'hero',
  'Responsible Gold Trading. Built on Governance.',
  'Sikamine Gold Trading Ltd provides structured, transparent and compliant gold sourcing, aggregation and trade solutions through partnerships with licensed miners, verified buyers and institutional stakeholders.',
  null, 'Partner With Us', '/partnerships', 'Explore Our Services', '/services', 'navy', 0, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, body, cta_label, cta_url, background_style, position, visible)
select id, 'text',
  'Structured Gold Trading With Integrity', null,
  $$<p>Sikamine Gold Trading Ltd is a Ghana-based gold trading and aggregation company focused on structured, compliant operations. We work directly with licensed miners and verified buyers, ensuring traceability, transparency and secure trade practices.</p>
<p>Our mission is to provide reliable gold sourcing and distribution while creating value for stakeholders and partners through disciplined operational and financial management.</p>$$,
  'Learn More About Sikamine', '/about', 'light', 1, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'services_grid', 'Our Core Services', null, 'alt', 2, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'pillars_grid', 'The Principles Behind Every Transaction', null, 'light', 3, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, body, background_style, position, visible)
select id, 'compliance', 'Compliance Is Built Into Our Operations', null,
  $$<p>Sikamine Gold Trading Ltd structures its operations around Ghanaian mining and gold trade requirements. From supplier engagement through documentation, sourcing and delivery, internal processes are designed to promote transparency, traceability and responsible trading practices.</p>
<ul>
<li>Ghana regulatory alignment</li>
<li>GOLDBOD/PMMC requirements</li>
<li>Ghana Companies Registry registration</li>
<li>Responsible sourcing policies</li>
<li>Transparent record-keeping</li>
<li>Supplier verification</li>
<li>Zero tolerance for non-compliant suppliers</li>
</ul>$$,
  'navy', 4, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, body, cta_label, cta_url, background_style, position, visible)
select id, 'text', 'Gold With Traceability', null,
  $$<p>Sikamine's sourcing principles prioritize:</p>
<ul>
<li>Licensed suppliers</li>
<li>Supplier verification</li>
<li>Source documentation</li>
<li>Transaction records</li>
<li>Governance</li>
<li>Responsible practices</li>
<li>Regulatory compliance</li>
<li>Traceability</li>
</ul>$$,
  'Learn About Responsible Sourcing', '/responsible-sourcing', 'light', 5, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, body, cta_label, cta_url, background_style, position, visible)
select id, 'partner_categories_grid', 'Building Responsible Partnerships',
  'Sikamine works with licensed miners, verified buyers and institutional stakeholders. As the company grows, its partnership network will expand to investors, suppliers and off-takers aligned with Sikamine''s governance and compliance standards.',
  null, 'Become a Partner', '/partnerships', 'alt', 6, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, body, background_style, position, visible)
select id, 'why_sikamine', 'Why Sikamine', null,
  $$<ul>
<li>Structured Operations</li>
<li>Transparent Processes</li>
<li>Responsible Sourcing</li>
<li>Compliance Focus</li>
<li>Verified Relationships</li>
<li>Institutional Governance</li>
<li>Secure Trade Practices</li>
<li>Professional Management</li>
</ul>$$,
  'light', 7, true
from pages where slug = 'home';

insert into page_sections (page_id, type, title, subtitle, cta_label, cta_url, secondary_cta_label, secondary_cta_url, background_style, position, visible)
select id, 'cta', 'Interested in Working With Sikamine?',
  'Speak with our team about gold supply, purchasing, off-take arrangements, partnerships or corporate enquiries.',
  'Contact Sikamine', '/contact', 'Partnership Enquiry', '/partnerships', 'navy', 8, true
from pages where slug = 'home';

-- ── about sections ───────────────────────────────────────────────────────
insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'hero', 'About Sikamine Gold Trading Ltd',
  'A Ghana-based gold trading and aggregation company focused on structured, compliant operations.',
  'navy', 0, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Company Overview',
  $$<p>Sikamine Gold Trading Ltd is a Ghana-based gold trading and aggregation company focused on structured, compliant operations. We work directly with licensed miners and verified buyers, ensuring traceability, transparency, and secure trade practices.</p>
<p>Our mission is to provide reliable gold sourcing and distribution while creating value for stakeholders and partners through disciplined operational and financial management.</p>$$,
  'light', 1, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Mission',
  '<p>To provide reliable, transparent and responsibly structured gold sourcing and distribution services while creating sustainable value for our partners and stakeholders.</p>',
  'alt', 2, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Vision',
  '<p>To be a trusted and respected Ghanaian gold trading and aggregation company, recognized for the strength of our governance, our commitment to compliance, and the integrity of our responsible sourcing practices.</p>',
  'light', 3, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Values',
  $$<ul>
<li>Governance and accountability in every decision</li>
<li>Uncompromising compliance with applicable regulation</li>
<li>Responsible, traceable sourcing</li>
<li>Transparency with partners and stakeholders</li>
<li>Professionalism in every relationship</li>
</ul>$$,
  'alt', 4, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Operational Philosophy',
  '<p>Sikamine structures every stage of its operations — supplier engagement, documentation, sourcing and delivery — around disciplined internal processes designed to promote transparency, traceability and responsible trading practice.</p>',
  'light', 5, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Corporate Governance',
  '<p>Sikamine''s governance framework sets the standard against which every operational decision is measured, from supplier verification through to trade documentation and delivery.</p>',
  'navy', 6, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, background_style, position, visible)
select id, 'pillars_grid', 'Our Pillars', 'light', 7, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, cta_label, cta_url, background_style, position, visible)
select id, 'text', 'Responsible Sourcing',
  '<p>Our sourcing principles prioritize licensed suppliers, supplier verification, documentation, governance and traceability at every stage.</p>',
  'Learn About Responsible Sourcing', '/responsible-sourcing', 'alt', 8, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'why_sikamine', 'Why Sikamine',
  $$<ul>
<li>Structured Operations</li>
<li>Transparent Processes</li>
<li>Responsible Sourcing</li>
<li>Compliance Focus</li>
<li>Verified Relationships</li>
<li>Institutional Governance</li>
</ul>$$,
  'light', 9, true from pages where slug = 'about';

insert into page_sections (page_id, type, title, subtitle, cta_label, cta_url, background_style, position, visible)
select id, 'cta', 'Interested in Working With Sikamine?',
  'Speak with our team about gold supply, purchasing, off-take arrangements, partnerships or corporate enquiries.',
  'Contact Sikamine', '/contact', 'navy', 10, true from pages where slug = 'about';

-- ── governance & compliance sections ─────────────────────────────────────
insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'hero', 'Compliance Is Built Into Our Operations',
  'Sikamine structures its operations around Ghanaian mining and gold trade requirements, promoting transparency, traceability and responsible trading practice at every stage.',
  'navy', 0, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Governance Philosophy',
  '<p>Every decision at Sikamine is measured against our governance standards. Governance is not a compliance afterthought — it is the framework within which sourcing, trading and partner relationships are structured.</p>',
  'light', 1, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Compliance Framework',
  $$<p>Sikamine structures its operations around applicable Ghanaian mining and gold trade requirements, including alignment with the Ghana Minerals Commission and relevant GOLDBOD/PMMC guidance.</p>
<ul>
<li>Ghana regulatory alignment</li>
<li>GOLDBOD/PMMC requirements</li>
<li>Ghana Companies Registry registration</li>
<li>Responsible sourcing policies</li>
</ul>$$,
  'alt', 2, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Supplier Verification',
  '<p>Suppliers are verified against Sikamine''s licensing and documentation requirements before any trade relationship begins, and remain subject to ongoing monitoring.</p>',
  'light', 3, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Traceability',
  '<p>Source documentation and transaction records are maintained across the sourcing and trade lifecycle to support traceability from supplier to buyer.</p>',
  'alt', 4, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Documentation',
  '<p>Trade documents, supplier records and compliance files are maintained according to relevant regulatory and auditing requirements.</p>',
  'light', 5, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Internal Controls',
  '<p>Internal controls govern supplier engagement, documentation, sourcing and delivery, and are reviewed as Sikamine''s operations grow.</p>',
  'alt', 6, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Record Keeping',
  '<p>Transparent, auditable record-keeping is maintained across all trade activity, in line with applicable regulatory expectations.</p>',
  'light', 7, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Zero-Tolerance Policy',
  '<p>Sikamine operates a zero-tolerance policy toward non-compliant suppliers and buyers. Parties that fail our compliance requirements are excluded from transactions.</p>',
  'navy', 8, true from pages where slug = 'governance-compliance';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Regulatory References',
  $$<p>References are provided for general informational purposes:</p>
<ul>
<li><a href="https://www.mincom.gov.gh" target="_blank" rel="noopener noreferrer">Ghana Minerals Commission</a></li>
</ul>
<p><em>Regulatory references are provided for general informational purposes. Applicable requirements may change, and parties should obtain appropriate professional or regulatory guidance for their specific circumstances.</em></p>$$,
  'light', 9, true from pages where slug = 'governance-compliance';

-- ── responsible sourcing sections ────────────────────────────────────────
insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'hero', 'Gold With Traceability',
  'Responsible, traceable sourcing is central to how Sikamine operates.',
  'navy', 0, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Our Responsible Sourcing Commitment',
  '<p>Sikamine sources gold only through channels that meet our licensing, documentation and traceability standards.</p>',
  'light', 1, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Licensed Supplier Requirement',
  '<p>All suppliers must hold appropriate licensing recognised under Ghanaian mining and gold trade regulation before Sikamine will trade with them.</p>',
  'alt', 2, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Supplier Due Diligence',
  '<p>Suppliers undergo a due diligence review before onboarding, and are subject to ongoing monitoring throughout the relationship.</p>',
  'light', 3, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Traceability',
  '<p>Every transaction is documented to support traceability of gold from source through to buyer.</p>',
  'alt', 4, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Documentation',
  '<p>Source and transaction documentation is retained in line with Sikamine''s record-keeping standards.</p>',
  'light', 5, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Operational Integrity',
  '<p>Operational integrity is non-negotiable across sourcing, trading and delivery.</p>',
  'alt', 6, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, background_style, position, visible)
select id, 'text', 'Zero-Tolerance Approach',
  '<p>Sikamine takes a zero-tolerance approach to non-compliant or unverifiable sourcing.</p>',
  'navy', 7, true from pages where slug = 'responsible-sourcing';

insert into page_sections (page_id, type, title, body, cta_label, cta_url, background_style, position, visible)
select id, 'text', 'Ongoing Monitoring',
  '<p>Supplier relationships are monitored on an ongoing basis to confirm continued compliance with our sourcing standards.</p>',
  'Work With Sikamine', '/contact', 'light', 8, true from pages where slug = 'responsible-sourcing';

-- ── partnerships sections ────────────────────────────────────────────────
insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'hero', 'Building Responsible Partnerships',
  'Sikamine works with licensed miners, verified buyers and institutional stakeholders. As the company grows, its partnership network will expand to investors, suppliers and off-takers aligned with our governance and compliance standards.',
  'navy', 0, true from pages where slug = 'partnerships';

insert into page_sections (page_id, type, title, background_style, position, visible)
select id, 'partner_categories_grid', 'Who We Work With', 'light', 1, true from pages where slug = 'partnerships';

insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'partnership_form', 'Partnership Enquiry',
  'Tell us about your organisation and how you''d like to work with Sikamine.',
  'alt', 2, true from pages where slug = 'partnerships';

-- ── contact sections ─────────────────────────────────────────────────────
insert into page_sections (page_id, type, title, subtitle, background_style, position, visible)
select id, 'hero', 'Interested in Working With Sikamine?',
  'Speak with our team about gold supply, purchasing, off-take arrangements, partnerships or corporate enquiries.',
  'navy', 0, true from pages where slug = 'contact';

insert into page_sections (page_id, type, background_style, position, visible)
select id, 'offices_grid', 'light', 1, true from pages where slug = 'contact';

insert into page_sections (page_id, type, title, background_style, position, visible)
select id, 'contact_form', 'Send Us a Message', 'alt', 2, true from pages where slug = 'contact';

-- ── legal documents ──────────────────────────────────────────────────────
insert into legal_documents (type, title, content, version, effective_date, published) values
(
  'terms', 'Terms & Conditions',
  $$<h2>1. Introduction</h2>
<p>These Terms and Conditions ("T&C") govern the use of services, business transactions and partnerships with Sikamine Gold Trading Ltd ("Sikamine", "we", "our", or "us").</p>
<p>By engaging with Sikamine, clients, suppliers, investors and partners ("you" or "the User") agree to be bound by these T&C.</p>
<p>Sikamine is committed to responsible, traceable and compliant gold sourcing in accordance with applicable Ghanaian laws and relevant gold trade regulations.</p>
<p>References may include the <a href="https://www.mincom.gov.gh" target="_blank" rel="noopener noreferrer">Ghana Minerals Commission</a> and relevant GOLDBOD/PMMC guidance.</p>
<h2>2. Scope of Services</h2>
<p>Sikamine provides services including:</p>
<ul>
<li>Sourcing and trading gold from appropriately licensed miners within Ghana.</li>
<li>Providing structured trade capital arrangements to qualified buyers and suppliers under defined trade cycles.</li>
<li>Facilitating approved participation in structured gold trade capital arrangements where permitted.</li>
<li>Supporting governance, compliance and responsible sourcing standards for partners and clients.</li>
</ul>
<h2>3. Investor & Trade Capital Agreements</h2>
<p><strong>Trade Capital Purpose:</strong> Capital provided under approved trade arrangements is intended for defined gold sourcing and trading operations and is not intended for personal use.</p>
<p><strong>Return Arrangements:</strong> Any applicable returns, fees or profit-sharing arrangements are to be defined in written agreements between the relevant parties.</p>
<p><strong>Capital Management:</strong> Funds must be managed through approved company processes with appropriate documentation and record keeping.</p>
<p><strong>Risk Disclosure:</strong> Gold trading involves commercial, operational, regulatory and market risks. Participation in any trade arrangement is subject to the terms of the relevant agreement.</p>
<p><strong>Profit Distribution:</strong> Where applicable, distributions are made in accordance with the contractual terms governing the relevant trade cycle.</p>
<h2>4. Supplier & Buyer Obligations</h2>
<ul>
<li>Gold suppliers must satisfy applicable licensing and regulatory requirements.</li>
<li>Gold purchased must meet applicable traceability requirements.</li>
<li>Buyers must meet Sikamine eligibility requirements and applicable Ghanaian regulations.</li>
</ul>
<h2>5. Compliance & Governance</h2>
<ul>
<li>Sikamine intends to conduct its operations in accordance with applicable Ghanaian laws and regulatory requirements.</li>
<li>Business records, trade documents and reports should be maintained according to relevant regulatory and auditing requirements.</li>
<li>Parties that fail Sikamine's compliance requirements may be excluded from transactions.</li>
</ul>
<h2>6. Confidentiality</h2>
<p>Proprietary information, trade volumes, pricing information, supplier information, buyer information and investor information are confidential where applicable. Such information must not be disclosed without appropriate authorization except where disclosure is required by law.</p>
<h2>7. Liability</h2>
<p>Sikamine's liability is subject to applicable law and the contractual terms governing individual transactions. Gold trading may involve market price fluctuations, operational risks, force majeure events and third-party risks.</p>
<h2>8. Termination</h2>
<p>Sikamine may terminate or suspend relationships with suppliers, buyers, investors or other partners where there is non-compliance, unethical behaviour, misrepresentation, fraud, breach of agreement, or regulatory risk. Withdrawal from specific trade arrangements is governed by the applicable written agreement.</p>
<h2>9. Governing Law</h2>
<p>These Terms and Conditions are governed by the laws of the Republic of Ghana. Disputes shall be handled according to applicable Ghanaian law and relevant contractual dispute-resolution provisions.</p>
<h2>10. Acknowledgement</h2>
<p>By engaging with Sikamine Gold Trading Ltd, relevant parties acknowledge that they have reviewed applicable terms, obligations, risks and governance requirements associated with the service or transaction in which they participate.</p>$$,
  '1.0', current_date, true
),
(
  'privacy', 'Privacy Policy',
  $$<h2>1. Information We Collect</h2>
<p>We collect information you submit through our contact and partnership enquiry forms (name, company, email, phone, country, message), together with basic technical information (IP address, browser/device information) for security and spam-prevention purposes.</p>
<h2>2. How We Use Information</h2>
<p>Information submitted is used to respond to enquiries, evaluate partnership applications, maintain internal records, and meet applicable legal and regulatory obligations.</p>
<h2>3. Cookies</h2>
<p>We use essential cookies required for the site to function, and, where enabled, analytics cookies to understand site usage. See our <a href="/cookies">Cookie Policy</a> for details.</p>
<h2>4. Data Security</h2>
<p>Submitted information is stored in an access-controlled database and is only accessible to authorised Sikamine personnel.</p>
<h2>5. Data Retention</h2>
<p>We retain enquiry and partnership records for as long as reasonably necessary for the purposes described above and to meet legal or regulatory requirements.</p>
<h2>6. Third-Party Services</h2>
<p>We may use third-party service providers (such as our hosting, database and email providers) solely to operate this website. These providers are contractually restricted from using your data for their own purposes.</p>
<h2>7. Your Rights</h2>
<p>You may request access to, correction of, or deletion of your personal information by contacting us using the details on our <a href="/contact">Contact page</a>.</p>
<h2>8. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. The effective date below reflects the latest version.</p>
<h2>9. Contact</h2>
<p>Questions about this policy can be directed to Sikamine Gold Trading Ltd via the contact details published on our Contact page.</p>$$,
  '1.0', current_date, true
),
(
  'cookies', 'Cookie Policy',
  $$<h2>What Are Cookies</h2>
<p>Cookies are small text files placed on your device to help websites function and, where enabled, to understand how visitors use a site.</p>
<h2>How We Use Cookies</h2>
<ul>
<li><strong>Essential cookies</strong> — required for core site functionality and security.</li>
<li><strong>Analytics cookies</strong> — used only where enabled, to understand aggregate traffic patterns. These may be provided by a client-owned analytics service.</li>
</ul>
<h2>Managing Cookies</h2>
<p>You can control or delete cookies through your browser settings. Disabling essential cookies may affect site functionality.</p>
<h2>Changes to This Policy</h2>
<p>We may update this Cookie Policy from time to time. The effective date below reflects the latest version.</p>$$,
  '1.0', current_date, true
);

-- ── SEO defaults ─────────────────────────────────────────────────────────
insert into seo_settings (route_key, seo_title, meta_description) values
  ('home', 'Sikamine Gold Trading Ltd | Responsible Gold Trading, Ghana',
   'Structured, transparent and compliant gold sourcing, aggregation and trade solutions from Sikamine Gold Trading Ltd, Ghana.'),
  ('about', 'About Sikamine Gold Trading Ltd',
   'A Ghana-based gold trading and aggregation company focused on structured, compliant operations.'),
  ('services', 'Our Services | Sikamine Gold Trading Ltd',
   'Gold trading, aggregator funding, compliance advisory and off-take partnerships from Sikamine Gold Trading Ltd.'),
  ('governance-compliance', 'Governance & Compliance | Sikamine Gold Trading Ltd',
   'How Sikamine structures its operations around governance, compliance and traceability in Ghanaian gold trade.'),
  ('responsible-sourcing', 'Responsible Sourcing | Sikamine Gold Trading Ltd',
   'Sikamine''s commitment to licensed suppliers, due diligence, traceability and responsible gold sourcing.'),
  ('partnerships', 'Partnerships | Sikamine Gold Trading Ltd',
   'Partner with Sikamine Gold Trading Ltd as a licensed miner, verified buyer, off-taker or institutional partner.'),
  ('contact', 'Contact Sikamine Gold Trading Ltd',
   'Get in touch with Sikamine Gold Trading Ltd for gold supply, purchasing, partnerships and corporate enquiries.'),
  ('terms', 'Terms & Conditions | Sikamine Gold Trading Ltd', 'Terms and conditions governing services and transactions with Sikamine Gold Trading Ltd.'),
  ('privacy', 'Privacy Policy | Sikamine Gold Trading Ltd', 'How Sikamine Gold Trading Ltd collects, uses and protects your information.'),
  ('cookies', 'Cookie Policy | Sikamine Gold Trading Ltd', 'How Sikamine Gold Trading Ltd uses cookies on this website.');
