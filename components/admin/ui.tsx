import { useId } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10";
export const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-grey";

/** Label + form control wrapper that wires up a stable id/htmlFor pair for accessibility. */
export function Field({
  label,
  children,
}: {
  label: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children(id)}
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-grey">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-black/5 bg-white p-6 shadow-sm", className)} {...props} />;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-xl border border-dashed border-black/15 py-12 text-center text-sm text-text-grey">{message}</div>;
}

export function Pill({ tone = "default", children }: { tone?: "default" | "success" | "warning" | "danger"; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    default: "bg-black/5 text-text-grey",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function AdminButton({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const variants: Record<string, string> = {
    primary: "bg-navy text-white hover:bg-navy-dark",
    secondary: "border border-black/10 text-text hover:bg-black/5",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-text-grey hover:text-navy",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ease-out active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
