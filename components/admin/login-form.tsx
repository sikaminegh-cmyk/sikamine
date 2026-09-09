"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.ok) {
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg" noValidate>
      <h1 className="font-heading text-xl font-bold text-navy">Admin Sign In</h1>
      <p className="mt-1 text-sm text-text-grey">Sikamine Gold Trading Ltd</p>

      <div className="mt-6">
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-4 py-3 pr-11 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-grey hover:text-navy"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="mt-6 w-full">
        {loading ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
