/**
 * بيانات التواصل والإعدادات المشتركة للموقع.
 * عدّل الرقم هنا مرة واحدة فقط لينعكس التغيير على كل الصفحات.
 */

/** رقم واتساب بصيغة دولية بدون + أو 00 */
export const WHATSAPP_NUMBER = "201055280865";

/** الرقم كما يظهر للزائر (الصيغة المحلية) */
export const PHONE_DISPLAY = "01055280865";

/** الرقم المستخدم في رابط الاتصال المباشر tel: */
export const PHONE_TEL = "+201055280865";

export const STORE_HOURS = "يومياً من 10 صباحاً حتى 11 مساءً";

/** اسم المتجر الرسمي */
export const SITE_NAME = "السلطان للمفروشات والمراتب والستائر";

/** وصف الموقع المختصر (يُستخدم في الـ Metadata) */
export const SITE_DESCRIPTION =
  "اكتشف الفخامة والراحة الملكية مع مفروشات ومراتب وستائر السلطان. مراتب طبية بنوابض منفصلة، ستائر مفصّلة على مقاسك، ومفروشات فندقية راقية.";

/**
 * رابط الموقع الرسمي الكامل (بدون / في النهاية).
 * ⚠️ غيّره لرابط الدومين الحقيقي قبل النشر — يُستخدم في الـ sitemap
 * وروابط canonical وصور المشاركة الاجتماعية.
 */
export const SITE_URL = "https://store-liart-nu.vercel.app";

/** رسالة الاستفسار الافتراضية لكل أزرار الموقع */
export const DEFAULT_ORDER_MESSAGE = "مرحباً مفروشات السلطان، أود الاستفسار عن العروض والتفصيل";

/** رسالة استفسار عامة عن المنتجات */
export const PRODUCTS_INQUIRY_MESSAGE = "مرحباً مفروشات السلطان، أود الاستفسار عن المنتجات والعروض";

/** يبني رابط واتساب مع رسالة جاهزة مشفّرة */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
