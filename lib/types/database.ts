// Hand-authored to mirror supabase/migrations/0001_init.sql. If the schema
// changes, update this file (or regenerate with `supabase gen types typescript`
// once a real project exists) — see docs/DATABASE.md.

export type AdminRole = "super_admin" | "administrator" | "editor";
export type AdminStatus = "active" | "inactive";
export type ActiveStatus = "active" | "inactive";
export type ContactStatus = "new" | "read" | "responded" | "archived";
export type PartnershipStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "qualified"
  | "declined"
  | "completed";
export type NavLocation = "header" | "footer";
export type LegalDocType =
  | "terms"
  | "privacy"
  | "cookies"
  | "disclaimer"
  | "responsible_sourcing_policy";

interface Timestamped {
  created_at: string;
  updated_at: string;
}

export interface AdminUserRow extends Timestamped {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  last_login_at: string | null;
}

export interface PageRow extends Timestamped {
  id: string;
  slug: string;
  title: string;
  published: boolean;
}

export interface PageSectionRow extends Timestamped {
  id: string;
  page_id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  video_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  background_style: string;
  position: number;
  visible: boolean;
}

export interface ServiceRow extends Timestamped {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  icon: string | null;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  position: number;
}

export interface PillarRow extends Timestamped {
  id: string;
  name: string;
  number: string | null;
  description: string | null;
  icon: string | null;
  position: number;
  status: ActiveStatus;
}

export interface PartnerCategoryRow extends Timestamped {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  position: number;
  status: ActiveStatus;
}

export interface OfficeLocationRow extends Timestamped {
  id: string;
  title: string;
  is_headquarters: boolean;
  country: string;
  region: string | null;
  city: string | null;
  street_address: string | null;
  postal_address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  maps_url: string | null;
  business_hours: Record<string, string>;
  visible: boolean;
  position: number;
}

export interface CompanyContactRow extends Timestamped {
  id: string;
  key: string;
  label: string;
  value: string | null;
  type: string;
  department: string | null;
  public_visible: boolean;
  position: number;
}

export interface ContactMessageRow extends Timestamped {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  enquiry_type: string;
  message: string;
  consent: boolean;
  status: ContactStatus;
  ip_address: string | null;
}

export interface PartnershipEnquiryRow extends Timestamped {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  partnership_type: string;
  message: string | null;
  consent: boolean;
  status: PartnershipStatus;
  internal_notes: string | null;
  ip_address: string | null;
}

export interface MediaRow {
  id: string;
  filename: string;
  storage_path: string;
  bucket: string;
  public_url: string | null;
  mime_type: string;
  size_bytes: number;
  alt_text: string | null;
  is_public: boolean;
  uploaded_by: string | null;
  created_at: string;
}

export interface LegalDocumentRow extends Timestamped {
  id: string;
  type: LegalDocType;
  title: string;
  content: string;
  version: string;
  effective_date: string;
  published: boolean;
}

export interface NavigationItemRow extends Timestamped {
  id: string;
  label: string;
  url: string;
  location: NavLocation;
  parent_id: string | null;
  group_key: string | null;
  is_external: boolean;
  position: number;
  visible: boolean;
}

export interface SiteSettingsRow {
  id: number;
  site_name: string;
  logo_url: string | null;
  dark_logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  default_seo_image: string | null;
  footer_copyright: string;
  footer_description: string;
  social_links: Record<string, string>;
  analytics_id: string | null;
  maintenance_mode: boolean;
  updated_at: string;
}

export interface SeoSettingsRow extends Timestamped {
  id: string;
  route_key: string;
  seo_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
}

export interface AuditLogRow {
  id: string;
  admin_id: string | null;
  admin_name: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface PartnerLogoRow extends Timestamped {
  id: string;
  name: string;
  category: string;
  logo_url: string;
  link_url: string | null;
  position: number;
  visible: boolean;
}

export interface TeamMemberRow extends Timestamped {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  position: number;
  visible: boolean;
}

export interface BlogPostRow extends Timestamped {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  published_at: string;
}

export interface AlbumRow extends Timestamped {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string;
}

export interface AlbumImageRow {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  position: number;
  created_at: string;
}
