import { cn } from "@/lib/utils";
import { Container } from "./container";

const backgrounds: Record<string, string> = {
  light: "bg-bg text-text",
  alt: "bg-bg-alt text-text",
  navy: "bg-navy text-white",
  dark: "bg-dark-bg text-white",
  white: "bg-white text-text",
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: string;
  containerClassName?: string;
}

export function Section({ background = "light", className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 lg:py-28", backgrounds[background] ?? backgrounds.light, className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange", className)}>
      {children}
    </p>
  );
}
