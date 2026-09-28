import test from 'node:test';
import assert from 'node:assert/strict';
import { leadSchema, normalizeEgyptianPhone, buildLeadMessage } from '../src/schemas/lead';
import { appointmentSchema, FABRIC_IDS } from '../src/schemas/appointment';
import { siteContentSchema } from '../src/schemas/site-content';
import { DEFAULT_SITE_CONTENT, DEFAULT_SUITE_SCENES } from '../src/lib/site-content-defaults';
import { CURTAIN_FABRICS } from '../src/data/curtains';

test('normalizeEgyptianPhone removes spaces and dashes', () => {
  assert.equal(normalizeEgyptianPhone('01055280865'), '01055280865');
  assert.equal(normalizeEgyptianPhone(' 010 5528 0865 '), '01055280865');
  assert.equal(normalizeEgyptianPhone('010-5528-0865'), '01055280865');
});

test('leadSchema accepts valid lead input', () => {
  const result = leadSchema.safeParse({
    name: 'محمد علي',
    phone: '010 5528 0865',
    product: 'royal-bed-suite',
    size: '180x200',
    notes: 'توصيل عاجل',
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.name, 'محمد علي');
    assert.equal(result.data.phone, '01055280865');
    assert.equal(result.data.product, 'royal-bed-suite');
  }
});

test('leadSchema rejects short names with Arabic error', () => {
  const result = leadSchema.safeParse({
    name: 'أ',
    phone: '01055280865',
    product: 'royal-bed-suite',
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues[0].message, /اكتب الاسم بالكامل/);
  }
});

test('leadSchema rejects invalid Egyptian phone numbers', () => {
  const badPhones = ['01312345678', '0101234567', '010123456789', 'abcdefghijk'];
  for (const phone of badPhones) {
    const res = leadSchema.safeParse({
      name: 'عميل تجريبي',
      phone,
      product: 'royal-bed-suite',
    });
    assert.equal(res.success, false, `phone ${phone} should fail`);
    if (!res.success) {
      assert.match(res.error.issues[0].message, /رقم موبايل مصري صحيح/);
    }
  }
});

test('leadSchema rejects honeypot filled by spam bots', () => {
  const result = leadSchema.safeParse({
    name: 'سبامر',
    phone: '01055280865',
    product: 'royal-bed-suite',
    company: 'Spam Corp',
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues[0].message, /تم رفض الطلب/);
  }
});

test('buildLeadMessage formats Arabic WhatsApp order text', () => {
  const msg = buildLeadMessage({
    name: 'أحمد',
    phone: '01055280865',
    product: 'كافر فاخر',
    size: '160x200',
    notes: 'الدور الثالث',
  });
  assert.match(msg, /طلب جديد من موقع السلطان/);
  assert.match(msg, /أحمد/);
  assert.match(msg, /كافر فاخر/);
  assert.match(msg, /160x200/);
  assert.match(msg, /الدور الثالث/);
});

test('appointmentSchema accepts valid appointment input', () => {
  const result = appointmentSchema.safeParse({
    name: 'سارة محمود',
    phone: '011-2345-6789',
    city: 'القاهرة',
    fabricId: 'velvet',
    notes: 'معاينة فيزا',
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.phone, '01123456789');
    assert.equal(result.data.city, 'القاهرة');
    assert.equal(result.data.fabricId, 'velvet');
  }
});

test('appointmentSchema rejects invalid fabricId', () => {
  const result = appointmentSchema.safeParse({
    name: 'سارة محمود',
    phone: '01123456789',
    fabricId: 'leather',
  });
  assert.equal(result.success, false);
});

test('appointmentSchema has expected fabrics', () => {
  assert.deepEqual(Array.from(FABRIC_IDS), ['velvet', 'linen', 'chiffon']);
});

test('siteContentSchema validates new sections and defaults', () => {
  const parsed = siteContentSchema.parse({});
  assert.equal(parsed.hero.titleLine1, 'السلطان');
  assert.equal(parsed.mattress.modelName, 'مرتبة السلطان رويال بوكيت');
  assert.equal(parsed.curtains.badge, 'تفصيل وتصميم حسب المقاس');
  assert.equal(parsed.testimonials.ratingAverage, '4.9');
  assert.equal(parsed.footer.guarantees.length, 4);
});

test('DEFAULT_SITE_CONTENT ships every CMS section with data', () => {
  assert.equal(DEFAULT_SITE_CONTENT.hero.scenes.length, 3);
  assert.equal(DEFAULT_SUITE_SCENES.length, 3);
  assert.ok(DEFAULT_SITE_CONTENT.mattress.layers.length > 0);
  assert.ok(DEFAULT_SITE_CONTENT.mattress.specs.length > 0);
  assert.ok(DEFAULT_SITE_CONTENT.testimonials.items.length > 0);
  assert.ok(DEFAULT_SITE_CONTENT.faq.length > 0);
  // الأقسام الجديدة: الحماية والوسائد والأقمشة.
  assert.equal(DEFAULT_SITE_CONTENT.protector.title, 'كافر وواقي');
  assert.equal(DEFAULT_SITE_CONTENT.protector.ctaText, 'اطلب الكافر الآن');
  assert.equal(DEFAULT_SITE_CONTENT.pillows.accent, 'النخبة الفاخرة');
  assert.equal(DEFAULT_SITE_CONTENT.pillows.highlights.length, 3);
  assert.equal(DEFAULT_SITE_CONTENT.curtains.fabrics.length, CURTAIN_FABRICS.length);
  assert.ok(DEFAULT_SITE_CONTENT.curtains.fabrics.every((f) => f.title && f.image));
  // صورة الموديل اختيارية وتُخفى افتراضياً للحفاظ على الشكل الحالي.
  assert.equal(DEFAULT_SITE_CONTENT.mattress.modelImage, '');
  // صور قسمي الواقي والوسائد اختيارية likewise (فارغ = مخفي حتى يرفعها المدير).
  assert.equal(DEFAULT_SITE_CONTENT.protector.image, '');
  assert.equal(DEFAULT_SITE_CONTENT.pillows.image, '');
  // يجب أن تطابق القيم الافتراضية النص المرئي في الصفحة الرئيسية
  assert.equal(DEFAULT_SITE_CONTENT.hero.titleLine2, 'للمفروشات والستائر');
  assert.equal(DEFAULT_SITE_CONTENT.footer.subTagline, 'راحة ملكية تستحقها في كل تفصيلة');
});

test('legacy stored site content upgrades cleanly to the new schema', () => {
  // حمولة قديمة كما كانت محفوظة قبل إضافة أقسام الـ CMS الجديدة.
  const legacy = {
    announcement: {
      badge: 'عرض محفوظ:',
      text: 'نص محفوظ',
      highlight: '9,999 ج.م',
      suffix: 'لقطة محفوظة',
      enabled: false,
    },
    hero: {
      badge: 'شارة محفوظة',
      titleLine1: 'سطر محفوظ',
      titleLine2: 'سطر ذهبي محفوظ',
      titleLine3: 'سطر ثالث محفوظ',
      description: 'وصف محفوظ',
      ctaText: 'زر محفوظ',
      features: [{ label: 'ميزة محفوظة' }],
    },
    contact: {
      phoneDisplay: '01000000000',
      whatsappNumber: '201000000000',
      storeHours: 'ساعات محفوظة',
      location: 'موقع محفوظ',
    },
    faq: [{ question: 'سؤال محفوظ؟', answer: 'إجابة محفوظة' }],
  };

  const merged = { ...DEFAULT_SITE_CONTENT, ...legacy };
  const parsed = siteContentSchema.parse(merged);

  // القيم المحفوظة سابقاً تُحترم كما هي.
  assert.equal(parsed.announcement.highlight, '9,999 ج.م');
  assert.equal(parsed.hero.titleLine2, 'سطر ذهبي محفوظ');
  assert.equal(parsed.hero.features.length, 1);
  assert.equal(parsed.contact.phoneDisplay, '01000000000');
  assert.equal(parsed.faq.length, 1);

  // الأقسام الجديدة تُملأ من القيم الافتراضية بدون كسر.
  assert.equal(parsed.mattress.title, DEFAULT_SITE_CONTENT.mattress.title);
  assert.equal(parsed.mattress.giftTitle, DEFAULT_SITE_CONTENT.mattress.giftTitle);
  assert.equal(parsed.curtains.accent, DEFAULT_SITE_CONTENT.curtains.accent);
  assert.equal(parsed.curtains.fabrics.length, DEFAULT_SITE_CONTENT.curtains.fabrics.length);
  assert.equal(parsed.protector.title, DEFAULT_SITE_CONTENT.protector.title);
  assert.equal(parsed.pillows.ctaText, DEFAULT_SITE_CONTENT.pillows.ctaText);
  // حقول الصورة الجديدة تُملأ تلقائياً للحمولات القديمة (تُخفى حتى يُرفع لها صور).
  assert.equal(parsed.protector.image, '');
  assert.equal(parsed.pillows.image, '');
  assert.equal(
    parsed.testimonials.ratingAverage,
    DEFAULT_SITE_CONTENT.testimonials.ratingAverage
  );
  assert.equal(parsed.footer.guarantees.length, 4);
});

test('siteContentSchema rejects empty hero scene video and empty layers', () => {
  const badScene = siteContentSchema.safeParse({
    hero: { scenes: [{ short: 'مشهد', videoSrc: '' }] },
  });
  assert.equal(badScene.success, false);

  const badLayer = siteContentSchema.safeParse({
    mattress: { layers: [{ title: '', desc: 'وصف' }] },
  });
  assert.equal(badLayer.success, false);

  const badRating = siteContentSchema.safeParse({
    testimonials: {
      items: [{ name: 'عميل', purchase: 'مرتبة', text: 'رائع', rating: 9 }],
    },
  });
  assert.equal(badRating.success, false);
});


