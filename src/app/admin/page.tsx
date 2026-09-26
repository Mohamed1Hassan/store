/**
 * بوابة لوحة الإدارة: تتحقق من كوكي الجلسة server-side قبل عرض أي بيانات.
 * غير المسجل → نموذج دخول. المسجل → جدول الطلبات.
 */

import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import { isAdminConfigured } from "@/lib/env";
import AdminDashboard from "./AdminDashboard";
import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  const configured = isAdminConfigured();

  return (
    <main className="min-h-screen bg-[#07090e] px-4 py-10 text-[#f4efe6] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex flex-col gap-2 text-center">
          <p className="text-xs font-bold text-[#ffd700]">لوحة تحكم السلطان</p>
          <h1 className="font-serif text-3xl font-black text-white md:text-4xl">
            إدارة <span className="gold-gradient-text">الطلبات</span>
          </h1>
          <p className="text-xs text-zinc-400">صفحة خاصة بصاحب المتجر فقط — لا تُفهرس ولا تُشارك رابطها.</p>
        </header>

        {!configured ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 text-center">
            <h2 className="mb-2 text-base font-black text-amber-300">اللوحة غير مهيأة بعد</h2>
            <p className="text-xs leading-relaxed text-amber-200/90">
              انسخ <span dir="ltr">.env.example</span> إلى <span dir="ltr">.env.local</span> واضبط
              <span dir="ltr"> ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET </span>
              ثم أعد تشغيل السيرفر.
            </p>
          </div>
        ) : session ? (
          <AdminDashboard adminEmail={session} />
        ) : (
          <AdminLoginForm />
        )}
      </div>
    </main>
  );
}
