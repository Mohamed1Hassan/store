"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07090e] px-6 text-center text-[#f4efe6]">
      <h1 className="text-2xl font-black text-white">حدث خطأ غير متوقع</h1>
      <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
        نعتذر منك — حدث خلل أثناء تحميل الصفحة. حاول مرة أخرى أو تواصل معنا
        على واتساب وسنساعدك فوراً.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] px-7 py-3 text-sm font-black text-[#07090e] transition hover:scale-[1.03]"
      >
        إعادة المحاولة
      </button>
    </main>
  );
}
