import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07090e] px-6 text-center text-[#f4efe6]">
      <span className="text-6xl font-black text-[#ffd700] font-serif">404</span>
      <h1 className="text-2xl font-black text-white">الصفحة غير موجودة</h1>
      <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
        يبدو أن الرابط الذي تبحث عنه غير متوفر. يمكنك العودة للصفحة الرئيسية
        وتصفح أقسام المراتب والستائر والمفروشات.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] px-7 py-3 text-sm font-black text-[#07090e] transition hover:scale-[1.03]"
      >
        العودة للرئيسية
      </Link>
    </main>
  );
}
