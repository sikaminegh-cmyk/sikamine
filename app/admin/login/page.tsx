import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
