"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#05115D", color: "#fff", textAlign: "center", padding: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Something Went Wrong</h1>
          <p style={{ marginTop: "0.75rem", opacity: 0.75, maxWidth: 380 }}>
            An unexpected error occurred while loading Sikamine Gold Trading Ltd.
          </p>
          <button
            onClick={reset}
            style={{ marginTop: "2rem", background: "#F9660E", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: 999, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
