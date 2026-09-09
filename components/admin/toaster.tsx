"use client";

import { Toaster as Sonner } from "sonner";

// Sonner's documented theming hook: these CSS custom properties recolor its
// built-in toast variants (icons, layout, animations included) without
// needing `unstyled` and rebuilding all of that ourselves.
const brandStyle = {
  "--normal-bg": "#05115D",
  "--normal-border": "#05115D",
  "--normal-text": "#ffffff",
  "--success-bg": "#05115D",
  "--success-border": "#05115D",
  "--success-text": "#ffffff",
  "--error-bg": "#dc2626",
  "--error-border": "#dc2626",
  "--error-text": "#ffffff",
  "--border-radius": "0.75rem",
} as React.CSSProperties;

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      closeButton
      style={brandStyle}
      icons={{
        success: <span className="h-2 w-2 rounded-full bg-orange" />,
      }}
      toastOptions={{
        classNames: {
          toast: "font-body shadow-lg",
          title: "font-semibold",
        },
      }}
    />
  );
}
