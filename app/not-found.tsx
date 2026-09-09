import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">404</p>
      <h1 className="mt-4 text-3xl font-bold">Page Not Found</h1>
      <p className="mt-3 max-w-sm text-white/70">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white hover:bg-orange-dark"
      >
        Return Home
      </Link>
    </div>
  );
}
