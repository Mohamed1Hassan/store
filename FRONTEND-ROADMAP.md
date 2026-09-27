# خطة إكمال الفرونت إند — مفروشات السلطان (3ezat)

> آخر تحديث: بعد إزالة كود الـ 3D بالكامل من المشروع.

## 1) الوضع الحالي (منفَّذ)

- ✅ حذف كل كود الـ 3D: `src/components/Scene3D.tsx`, `src/components/ControlsPanel.tsx`, ومجلد `public/models/` (bed.glb بحجم 21MB + pillow.glb).
- ✅ إزالة حزم `three` و`@types/three` من المشروع.
- ✅ إزالة نوع `ProductMode` واستبداله بـ `CategoryId` (معرّف في `src/data/products.ts`).
- ✅ ملف ثوابت مركزي `src/data/site.ts`: رقم واتساب، التليفون، ساعات العمل، رسائل جاهزة، ودالة `whatsappLink()`.
- ✅ إزالة حقول الـ 3D من كتالوج المنتجات `PRODUCTS_CATALOG` مع الحفاظ على الأسعار والمميزات.
- ✅ إصلاح 5 روابط مكسورة في الفوتر + تحويل رقم التليفون لرابط `tel:`.
- ✅ تحويل الكروت القابلة للنقر إلى عناصر `<button>` حقيقية (تعمل بالكيبورد وقارئ الشاشة): طبقات المرتبة وأقمشة الستائر.
- ✅ استبدال أزرار «معاينة في المشهد 3D» بأزرار طلب واتساب فعلية.
- ✅ إزالة الأيقونات والاستيرادات غير المستخدمة (Navbar / CurtainSection / Footer).
- ✅ تحديث وصف الموقع (metadata) لإزالة ذكر التجربة ثلاثية الأبعاد.
- ✅ توحيد تبويب «الرئيسية الملكية» على `room` (كان `all` غير مُعرَّف في النوع فلم يكن يظهر كتبويب نشط).
- ✅ ضبط أنواع النافبار: `onSelectCategory` و`activeCategory` و`navItems` أصبحت من نوع `CategoryId`.
- ✅ **المرحلة 1 منفَّذة بالكامل**: إصلاح التثبيت (`zod/v4` + swc) → `npm run lint` يمر بدون أخطاء · تعريف `animate-fade-in` في `globals.css` · حذف الأصول الميتة (5 SVG + `hotel-detail-4397.mp4`) · أيقونة الموقع `src/app/icon.jpg` وحذف `favicon.ico` الافتراضي · بنية عناوين صحيحة (`h1` واحد + `h2` للأقسام والفوتر) وتحويل لوجو النافبار لزر حقيقي · README حقيقي · ضبط `next.config.ts` (`poweredByHeader: false` + كاش الفيديو).
- ✅ **رقم التواصل الحقيقي**: `01055280865` (واتساب دولي `201055280865`) مضبوط في `src/data/site.ts`.
- ✅ **المرحلة 2 (جزئياً)**: أضيفت أقسام `protector-section` (كافر المراتب) و`pillows-section` (المفروشات والوسائد) و`products-section` (كتالوج كامل بالأسعار وأزرار طلب لكل منتج)، مع مكوّن `SectionHeading` مشترك، ونقل محتوى المراتب والأقمشة إلى `src/data/mattress.ts` و`src/data/curtains.ts`، وربط تبويبات النافبار وروابط الفوتر بالـ ids الحقيقية. أُضيف حقل `savingLabel` (مبلغ التوفير) للكتالوج.
- ✅ **تكملة المرحلة 2**: قسم `testimonials-section` (6 آراء + ملخص تقييم 4.9/5 + شارات ثقة) وقسم `faq-section` (7 أسئلة بأكورديون `<details>` بدون JS + كارت تواصل + JSON-LD نوع FAQPage)، ومحتواهما في `src/data/testimonials.ts` و`src/data/faq.ts`. الفوتر أصبح 8 روابط كلها لأقسام حقيقية. الصفحة الآن **8 أقسام** بعد الهيرو (بإضافة قسم الطلب `order-section`).
- ✅ **المرحلة 3 (التحويل) منفذة بالكامل**: نموذج OrderForm + زر واتساب عائم + شريط عرض عاجل بعدّاد تنازلي + تتبع الضغطات عبر data-track وdataLayer (جاهز لـ GA4/GTM).
- ✅ **المرحلة 4 (SEO) منفذة**: ملفات robots.ts + sitemap.ts + manifest.ts + صورة opengraph-image.tsx (1200×630) + metadata شاملة (metadataBase/canonical/openGraph ar_EG/twitter/keywords/robots) + theme-color عبر viewport + أيقونات icon/apple + JSON-LD من نوع FurnitureStore في layout + Product/Offer لكل منتج في ProductsGrid (بجانب FAQPage الموجود). SITE_URL مضبوط على الدومين الحقيقي: https://store-liart-nu.vercel.app
- ✅ **المرحلة 5 (جزئياً)**: تحميل ذكي للفيديو (IntersectionObserver + preload=metadata + رجوع للـ poster عند الفشل + احترام prefers-reduced-motion) · صيغ AVIF/WebP في next.config · sizes لصور الشعار · صفحتا not-found وerror مخصصتان · CI على GitHub Actions (tsc + lint + build). المتبقي: ضغط الفيديوهات بـ ffmpeg (غير متوفر في البيئة — luxury-bed-suite.mp4 ما زال 5.49MB) + اختبارات Vitest/Playwright + قياس Lighthouse.
## 2) الاتفاقيات الإلزامية لأي شغل قادم

| البند | القاعدة |
|---|---|
| الإطار | Next.js 16 App Router + React 19 + TypeScript strict |
| الاستيراد | alias `@/*` من داخل `src/` |
| الستايل | Tailwind v4 inline فقط (بدون ملفات CSS إضافية) |
| الألوان | خلفية `#07090e` · ذهبي `#d4af37` / `#ffd700` / `#b8860b` · نص `#f4efe6` |
| الاتجاه | RTL لكل النصوص، الأيقونات من `lucide-react` |
| الحركة | keyframes في `globals.css` فقط + احترام `prefers-reduced-motion` |
| التواصل | كل الأرقام والرسائل من `src/data/site.ts` فقط (ممنوع تكرار الرقم في أي مكوّن) |
| المنتجات | كل بيانات المنتجات من `src/data/products.ts` |
| التحويل | كل CTA = `whatsappLink(...)` أو مكوّن `<OrderForm />` |
| الأزرار | عناصر `<button>` / `<a>` حقيقية، ممنوع `div onClick` |

## 3) قرارات مطلوبة من صاحب المتجر (Blockers)

1. ~~رقم واتساب + تليفون حقيقي~~ ✅ **تم** — `01055280865` مضبوط في `src/data/site.ts`.
2. العنوان الفعلي للمعرض + رابط الموقع على خرائط جوجل.
3. روابط السوشيال ميديا (فيسبوك / إنستجرام / تيك توك).
4. صور حقيقية: المنتجات، غرف النوم، أعمال الستائر، وصور المعرض.
5. هل تُعرض الأسعار للعامة أم نستبدلها بـ «اطلب السعر»؟
6. آلية استلام الطلبات: واتساب فقط، أم نموذج + API/إيميل؟
7. سياسة الاستبدال والشحن الرسمية (لصفحة الشروط والخصوصية).

## 4) خارطة المراحل

### المرحلة 1 — تثبيت الأساس ✅ (منفَّذة)

> **تمت بالكامل** — كل المهام من 1.1 إلى 1.7 منفَّذة، والتفاصيل في قسم «الوضع الحالي» بالأعلى.

| # | المهمة | الملف | معيار القبول |
|---|---|---|---|
| 1.1 | إصلاح التثبيت: `npm ci` (zod/v4 ناقص + swc binary غير صالح) | `package-lock.json` | `npm run lint` أخضر بدون أخطاء بيئة |
| 1.2 | تعريف `animate-fade-in` (مستخدم ومش معرّف حالياً) | `globals.css` | القائمة الموبايل وتنبيه الطلب يظهرون بأنيميشن |
| 1.3 | حذف الأصول الميتة: 5 ملفات SVG الافتراضية + `hotel-detail-4397.mp4` | `public/` | صفر ملفات غير مستخدمة |
| 1.4 | أيقونة الموقع الحقيقية: `src/app/icon.png` + حذف `favicon.ico` الافتراضي | `src/app/` | التاب يعرض شعار المحل |
| 1.5 | إصلاح العناوين: `h1` واحد فقط + تسلسل سليم في الفوتر | `Navbar.tsx`, `Footer.tsx` | هيكل عناوين صحيح للـ SEO |
| 1.6 | README حقيقي (تشغيل + بنية + قرارات) | `README.md` | أي مطوّر يفهم المشروع في دقيقتين |
| 1.7 | ضبط `next.config.ts`: `poweredByHeader: false` + headers لكاش الأصول | `next.config.ts` | تحسين بسيط في الأداء |

### المرحلة 2 — الأقسام الناقصة (أكبر أثر على العميل)

> **منفَّذ بالكامل:** 2.1 كافر المراتب · 2.2 المفروشات والوسائد · 2.3 شبكة كتالوج المنتجات · 2.4 آراء العملاء · 2.5 الأسئلة الشائعة (أكورديون بـ `<details>` + JSON-LD نوع FAQPage) · 2.7 ربط التبويبات والفوتر بالأقسام الحقيقية · 2.8 فصل المحتوى عن العرض (`mattress.ts` / `curtains.ts` / `testimonials.ts` / `faq.ts` + مكوّن `SectionHeading` مشترك).
> **المتبقي:** 2.6 معرض الأعمال (محتاج صور حقيقية من المعرض) — وكذلك استبدال محتوى `testimonials.ts` بآراء حقيقية قبل النشر.

| # | المهمة | الملف | تفاصيل التنفيذ |
|---|---|---|---|
| 2.1 | قسم **كافر المراتب** | `src/components/ProtectorSection.tsx` + `id="protector-section"` | عرض المنتج (850 ج.م بدل 1,200) ومميزاته الأربعة + CTA واتساب |
| 2.2 | قسم **المفروشات والوسائد** | `src/components/PillowsSection.tsx` + `id="pillows-section"` | طقم الوسائد (1,450 ج.م) + شريط «هدية كافر مع كل مرتبة» |
| 2.3 | قسم **منتجات المعرض** | `src/components/ProductsGrid.tsx` + `id="products-section"` | `map` على `PRODUCTS_CATALOG`: كارت (اسم · سعر · سعر قديم مشطوب · مميزات · CTA) |
| 2.4 | قسم **آراء العملاء** | `src/components/Testimonials.tsx` | 4–6 شهادات + تقييم نجوم + الاسم/المدينة |
| 2.5 | قسم **الأسئلة الشائعة** | `src/components/FaqSection.tsx` | أكورديون بـ `<details>/<summary>` (بدون JS) + JSON-LD نوع FAQPage |
| 2.6 | قسم **معرض الأعمال** | `src/components/GallerySection.tsx` | شبكة صور بـ `next/image` + Lightbox بسيط |
| 2.7 | ربط التبويبات بالأقسام الحقيقية | `Navbar.tsx`, `Footer.tsx`, `page.tsx` | تحديث `handleSelectCategory` بعد إضافة الـ ids الجديدة |
| 2.8 | فصل المحتوى عن العرض | `src/data/testimonials.ts`, `src/data/faq.ts` | نفس نمط `products.ts` (بيانات منفصلة عن المكوّن) |

**معيار القبول:** كل تبويب في النافبار يوصل لقسمه الحقيقي، كل قسم فيه CTA واحد واضح، مفيش روابط `#` مكسورة.

### المرحلة 3 — التحويل وجمع الطلبات (Lead Generation)

| # | المهمة | تفاصيل التنفيذ |
|---|---|---|
| 3.1 | مكوّن `<OrderForm />` | الاسم · التليفون · المنتج (`select` من الكتالوج) · المقاس · ملاحظات + Validation لتليفون مصري + رسائل خطأ عربية |
| 3.2 | إرسال الطلب | بناء رسالة منسّقة عبر `whatsappLink()` (الحل الفوري)، وعند الحاجة `src/app/api/leads/route.ts` للحفظ أو الإيميل |
| 3.3 | زر واتساب عائم | `src/components/WhatsAppFloatButton.tsx` — ثابت أسفل الشاشة، يظهر بعد تمرير 300px |
| 3.4 | عنصر إلحاح (Urgency) | شريط عرض أعلى الموقع أو عدّاد تنازلي لعرض محدّد |
| 3.5 | قياس التحويلات | Vercel Analytics أو GA4 + حدث مخصص لكل CTA (`whatsapp_click` / `order_submit`) |
| 3.6 | استخدام `canvas-confetti` | الحزمة موجودة بالفعل في المشروع — تُستخدم عند نجاح إرسال الطلب بدل ما تفضل حزمة غير مستخدمة |

**معيار القبول:** الفورم يعمل على الموبايل، الطلب يوصل واتساب/الإيميل بكل البيانات، وكل ضغطات CTA متسجّلة.

### المرحلة 4 — SEO والظهور الاجتماعي

| # | المهمة | الملف | تفاصيل التنفيذ |
|---|---|---|---|
| 4.1 | ملفات الزحف | `src/app/robots.ts`, `src/app/sitemap.ts` | توليد ديناميكي من بيانات الموقع |
| 4.2 | Metadata شاملة | `src/app/layout.tsx` | `metadataBase` · `openGraph` · `twitter` · `keywords` · `alternates.canonical` |
| 4.3 | صورة المشاركة | `src/app/opengraph-image.tsx` أو صورة 1200×630 في `public/` | تظهر عند مشاركة الرابط على واتساب/فيسبوك |
| 4.4 | بيانات منظمة JSON-LD | `layout.tsx` أو مكوّن `StructuredData` | `LocalBusiness` + `Product`/`Offer` لكل منتج + `FAQPage` |
| 4.5 | أساسيات PWA | `src/app/manifest.ts` + `theme-color` + `apple-icon` | أيقونة ولون شريط المتصفح على الموبايل |

**معيار القبول:** اجتياز اختبار Rich Results، وظهور صحيح للرابط عند المشاركة.

### المرحلة 5 — الأداء والجودة

| # | المهمة | تفاصيل التنفيذ |
|---|---|---|
| 5.1 | ضغط الفيديوهات | `luxury-bed-suite.mp4` حجمه 5.5MB حالياً → نسخ مضغوطة (H.264/WebM) + نسخة موبايل أخف |
| 5.2 | تحميل ذكي للفيديو | تحميل عند الظهور (IntersectionObserver) + `onError` للرجوع للـ poster + احترام `prefers-reduced-motion` |
| 5.3 | الصور | `next/image` مع `sizes` + صيغ WebP/AVIF |
| 5.4 | اختبارات | Vitest للداتا والمكوّنات + Playwright للتدفق الأساسي (تصفح → CTA → واتساب) |
| 5.5 | CI | GitHub Actions: `lint` + `tsc` + `build` + `tests` على كل Pull Request |
| 5.6 | قياس | Lighthouse ≥ 90 في الأداء والوصولية وأفضل الممارسات وSEO |

**معيار القبول:** تقرير Lighthouse + CI أخضر.

## 5) البنية المقترحة بعد الإكمال

```
src/
├─ app/
│  ├─ layout.tsx · page.tsx · globals.css
│  ├─ robots.ts · sitemap.ts · manifest.ts · opengraph-image.tsx
│  └─ error.tsx · not-found.tsx
├─ components/
│  ├─ Navbar · Footer · CinematicSuiteBanner
│  ├─ MattressSection · CurtainSection
│  ├─ ProtectorSection · PillowsSection · ProductsGrid
│  ├─ Testimonials · FaqSection · GallerySection
│  └─ OrderForm · WhatsAppFloatButton · SectionHeading
└─ data/
   ├─ site.ts · products.ts
   └─ testimonials.ts · faq.ts · gallery.ts
```

## 6) ترتيب التنفيذ المقترح

| الأولوية | المرحلة | السبب |
|---|---|---|
| 1 | المرحلة 1 — الأساس | إصلاحات سريعة تمنع تراكم المشاكل (lint · أصول ميتة · أيقونة · عناوين) |
| 2 | المرحلة 2 — الأقسام | المحتوى الناقص هو أكبر فرق لحظي في إقناع العميل |
| 3 | المرحلة 3 — التحويل | بعد وجود الأقسام، الفورم والزر العائم يرفعان التحويل مباشرة |
| 4 | المرحلة 4 — SEO | نتائجه تدريجية، فالأفضل البدء به مبكراً |
| 5 | المرحلة 5 — الأداء والجودة | صقل نهائي قبل التسليم |

## 7) طريقة التتبّع

- كل مهمة لها رقم ثابت (مثال `2.3`) — استخدمه في أي نقاش أو طلب تعديل.
- بعد إنجاز أي مهمة: تُنقل كسطر ✅ داخل قسم «الوضع الحالي» بالأعلى.
- لا تُغلق أي مرحلة قبل تحقيق «معيار القبول» المكتوب أسفلها.

## 8) ملاحظات تنفيذية مهمة

- **لا يوجد أي اعتماد على 3D أو `three.js` بعد الآن** — أي «معاينة» مستقبلية تكون بصور/فيديو فقط.
- كل الرسائل الجاهزة موجودة في `src/data/site.ts` (`DEFAULT_ORDER_MESSAGE`, `PRODUCTS_INQUIRY_MESSAGE`) — أي رسالة جديدة تُضاف هناك.
- لا تُكرِّر رقم الواتساب في أي مكوّن — استخدم `whatsappLink()` دائماً.
- أي مكوّن جديد: `"use client"` فقط لو محتاج state/events، وإلا يبقى Server Component.


