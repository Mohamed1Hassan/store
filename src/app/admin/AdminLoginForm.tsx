"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Crown, LogIn } from "lucide-react";

/** نموذج دخول المالك — يضرب POST /api/admin/login ثم يحدّث الصفحة */
export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error ?? "تعذر تسجيل الدخول.");
        return;
      }
      window.location.reload();
    } catch {
      setError("تعذر الاتصال بالسيرفر. تحقق من الإنترنت وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-5 rounded-3xl border border-[#d4af37]/30 bg-[#0b0e17] p-6 shadow-2xl md:p-8"
    >
      <div className="flex items-center justify-center gap-2 text-[#ffd700]">
        <Crown className="h-5 w-5" />
        <span className="text-sm font-black">دخول المالك</span>
      </div>

      <div>
        <label htmlFor="admin-email" className="mb-2 block text-xs font-bold text-zinc-300">
          البريد الإلكتروني
        </label>
        <input
          id="admin-email"
          type="email"
          dir="ltr"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="owner@sultan.store"
          className={`${fieldClass} text-left`}
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="mb-2 block text-xs font-bold text-zinc-300">
          كلمة المرور
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className={fieldClass}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-bold text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] py-3.5 text-sm font-black text-black shadow-xl shadow-[#d4af37]/25 transition hover:scale-[1.02] disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" />
        <span>{loading ? "جاري التحقق..." : "دخول اللوحة"}</span>
      </button>
    </form>
  );
}
