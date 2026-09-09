import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-orange text-white shadow-sm hover:bg-orange-dark hover:shadow-md hover:shadow-orange/20",
  secondary: "bg-navy text-white shadow-sm hover:bg-navy-dark hover:shadow-md hover:shadow-navy/20",
  outline: "border border-current/30 text-current hover:bg-black/5",
  ghost: "text-current hover:underline underline-offset-4",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}

export function LinkButton({ href, variant = "primary", className, children, external }: LinkButtonProps) {
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(base, variants[variant], className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
