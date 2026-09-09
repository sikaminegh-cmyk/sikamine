import type { AdminRole } from "@/lib/types/database";
import {
  LayoutDashboard,
  FileText,
  Package,
  Layers,
  Users2,
  Building2,
  Contact,
  Inbox,
  Handshake,
  Image as ImageIcon,
  ScrollText,
  Search,
  Menu as MenuIcon,
  Settings,
  ShieldCheck,
  History,
  Info,
  Landmark,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: AdminRole[];
}

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, roles: ["super_admin", "administrator", "editor"] },
  { label: "Pages", href: "/admin/pages", icon: FileText, roles: ["super_admin", "administrator", "editor"] },
  { label: "Services", href: "/admin/services", icon: Package, roles: ["super_admin", "administrator", "editor"] },
  { label: "Pillars", href: "/admin/pillars", icon: Layers, roles: ["super_admin", "administrator", "editor"] },
  { label: "Partner Categories", href: "/admin/partner-categories", icon: Users2, roles: ["super_admin", "administrator", "editor"] },
  { label: "Team Members", href: "/admin/team", icon: Users, roles: ["super_admin", "administrator", "editor"] },
  { label: "Offices", href: "/admin/offices", icon: Building2, roles: ["super_admin", "administrator", "editor"] },
  { label: "Company Contacts", href: "/admin/company-contacts", icon: Contact, roles: ["super_admin", "administrator", "editor"] },
  { label: "Contact Messages", href: "/admin/messages", icon: Inbox, roles: ["super_admin", "administrator", "editor"] },
  { label: "Partnership Enquiries", href: "/admin/partnership-enquiries", icon: Handshake, roles: ["super_admin", "administrator", "editor"] },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon, roles: ["super_admin", "administrator", "editor"] },
  { label: "Partner & Regulator Logos", href: "/admin/partner-logos", icon: Landmark, roles: ["super_admin", "administrator", "editor"] },
  { label: "Legal Documents", href: "/admin/legal", icon: ScrollText, roles: ["super_admin", "administrator", "editor"] },
  { label: "SEO", href: "/admin/seo", icon: Search, roles: ["super_admin", "administrator"] },
  { label: "Navigation", href: "/admin/navigation", icon: MenuIcon, roles: ["super_admin", "administrator"] },
  { label: "Site Settings", href: "/admin/settings", icon: Settings, roles: ["super_admin", "administrator"] },
  { label: "Admin Users", href: "/admin/admins", icon: ShieldCheck, roles: ["super_admin"] },
  { label: "Audit Log", href: "/admin/audit-log", icon: History, roles: ["super_admin", "administrator"] },
  { label: "System Information", href: "/admin/system-info", icon: Info, roles: ["super_admin"] },
];
