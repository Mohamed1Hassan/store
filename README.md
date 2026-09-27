# مفروشات ومراتب وستائر السلطان | Al-Sultan Luxury Living

موقع تسويقي عربي (RTL) لمتجر «السلطان للمفروشات والمراتب والستائر وكافر المراتب» — صفحة هبوط سينمائية بثيم ذهبي/داكن، أزرار طلب واتساب، وأقسام مواصفات تفاعلية.

## التشغيل

```bash
npm install       # تثبيت الحزم (يشغّل postinstall: prisma generate)
npm run dev       # بيئة التطوير على http://localhost:3000
npm run build     # بناء الإنتاج
npm run start     # تشغيل نسخة الإنتاج
npm run lint      # فحص الكود
npx tsc --noEmit  # فحص الأنواع
npm test          # اختبارات الوحدة
```

### قاعدة البيانات (اختياري محلياً، إلزامي في الإنتاج)

بدون `DATABASE_URL` يعمل كل شيء بمخزن JSON محلي في `.data/` (تطوير فقط — البيانات تضيع عند النشر على Vercel).
مع ضبط `DATABASE_URL` (Neon/Supabase) تعمل كل المخازن عبر Prisma تلقائياً دون أي تغيير في الكود:

```bash
npm run db:generate   # توليد Prisma Client (يحدث تلقائياً بعد postinstall)
npm run db:push       # إنشاء الجداول: Product / Lead / Appointment / EventLog
npm run db:seed       # ترحيل كتالوج src/data/products.ts إلى جدول Product
npm run db:studio     # تصفح قاعدة البيانات محلياً
```

> **ملاحظة بيئة:** لو ظهر تحذير `Attempted to load @next/swc-win32-x64-msvc ... not a valid Win32 application` فمعناه أن حزمة SWC الأصلية ناقصة/معطوبة، و Next.js يتحول تلقائياً لـ WASM والبناء ينجح. للإصلاح: احذف `node_modules/@next/swc-win32-x64-msvc` ثم شغّل `npm install`.

## التقنيات

- **Next.js 16** (App Router + webpack) · **React 19** · **TypeScript** (strict)
- **Prisma 6 + PostgreSQL** (Neon/Supabase) مع مخزن احتياطي JSON محلي عند غياب `DATABASE_URL`
- **zustand** لحالة السلة (persist محلي) · **zod** للتحقق من كل مدخلات الـ API
- **Tailwind CSS v4** (`@tailwindcss/postcss`) — كل التنسيق classes مباشرة
- **lucide-react** للأيقونات · **canvas-confetti** (لتأكيد الطلب — المرحلة 3)
- الخطوط: **Cairo** للعربي + **Playfair Display** للاتيني عبر `next/font`

## بنية المشروع

```
src/
├─ app/
│  ├─ layout.tsx       # RTL + الخطوط + metadata
│  ├─ page.tsx         # الصفحة الرئيسية (الأقسام والتبويبات)
│  ├─ globals.css      # Tailwind v4 + الألوان + keyframes
│  └─ icon.jpg         # أيقونة الموقع
├─ components/
│  ├─ Navbar.tsx                # شريط التنقل (ثابت + قائمة موبايل)
│  ├─ CinematicSuiteBanner.tsx   # فيديو الهيرو بثلاثة مشاهد
│  ├─ MattressSection.tsx       # طبقات المرتبة + كافر المراتب
│  ├─ CurtainSection.tsx        # 3 أنواع أقمشة + CTA معاينة مجانية
│  └─ Footer.tsx                # أقسام + ضمانات + بيانات التواصل
└─ data/
   ├─ site.ts         # ⚠️ أرقام التواصل والرسائل الجاهزة
   └─ products.ts     # كتالوج المنتجات + نوع CategoryId
public/
├─ videos/            # فيديوهات وصور الهيرو
└─ logo.jpg
```

## قواعد أساسية للمساهمة

1. **أرقام التواصل والرسائل:** من `src/data/site.ts` فقط — ممنوع تكرار الرقم في أي مكوّن، واستخدم `whatsappLink("الرسالة")`.
2. **بيانات المنتجات:** من `src/data/products.ts` (مع نوع `CategoryId`).
3. **الأزرار:** عناصر `<button>` / `<a>` حقيقية — ممنوع `div onClick`.
4. **الحركة:** أي keyframes جديدة في `globals.css` + أضفها لقائمة `prefers-reduced-motion`.
5. **الألوان:** خلفية `#07090e` · ذهبي `#d4af37` / `#ffd700` / `#b8860b` · نص `#f4efe6`.
6. **العناوين:** `h1` واحد فقط في الصفحة (الهيرو)، ثم `h2` للأقسام.
7. **لا يوجد 3D** ولا حزم Three.js — أي معاينة مستقبلية تكون بصور/فيديو.

## خارطة الطريق

خطة إكمال الفرونت إند بالتفصيل (5 مراحل / 34 مهمة + معايير قبول) في [`FRONTEND-ROADMAP.md`](./FRONTEND-ROADMAP.md).

الخطة العليا لإكمال المشروع 100% (قواعد البيانات · إدارة الكتالوج · السلة · التتبع · الأمان) مع سجل التنفيذ والتحقق في [`MASTER-ROADMAP.md`](./MASTER-ROADMAP.md).
