// Deliberately explicit (not `import * as Icons from "lucide-react"`).
// lucide-react ships 6000+ exports; a namespace import pulls its entire type
// surface into every file that uses it for no real benefit here — a small
// curated map is lighter for bundling and IDE performance.
//
// Admin "icon" fields still accept free text; anything outside this list
// just falls back to the default icon. Add names here as needed.
import { createElement } from "react";
import {
  Coins,
  Landmark,
  ShieldCheck,
  Handshake,
  Gavel,
  FileCheck,
  Leaf,
  ShieldAlert,
  Pickaxe,
  Package,
  BadgeCheck,
  Truck,
  Building2,
  TrendingUp,
  Users2,
  Globe,
  Scale,
  ClipboardCheck,
  FileText,
  Lock,
  Eye,
  Compass,
  Award,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  CircleDollarSign,
  BarChart3,
  Layers,
  Anchor,
  Ship,
  Warehouse,
  Factory,
  Gem,
  KeyRound,
  Fingerprint,
  Network,
  HeartHandshake,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  Search,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export const iconRegistry: Record<string, LucideIcon> = {
  Coins,
  Landmark,
  ShieldCheck,
  Handshake,
  Gavel,
  FileCheck,
  Leaf,
  ShieldAlert,
  Pickaxe,
  Package,
  BadgeCheck,
  Truck,
  Building2,
  TrendingUp,
  Users2,
  Globe,
  Scale,
  ClipboardCheck,
  FileText,
  Lock,
  Eye,
  Compass,
  Award,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  CircleDollarSign,
  BarChart3,
  Layers,
  Anchor,
  Ship,
  Warehouse,
  Factory,
  Gem,
  KeyRound,
  Fingerprint,
  Network,
  HeartHandshake,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  Search,
  HelpCircle,
};

export const iconNames = Object.keys(iconRegistry);

export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && iconRegistry[name]) || HelpCircle;
}

export function DynamicIcon({ name, size = 20, className }: { name: string | null | undefined; size?: number; className?: string }) {
  // Looks up an existing icon from the static registry above (never defines
  // a new component), so React.createElement is used directly here instead
  // of `const Icon = getIcon(name); return <Icon .../>` — that shape trips
  // the react-hooks/static-components lint rule, which can't tell a lookup
  // apart from an inline component definition.
  return createElement(getIcon(name), { size, className });
}
