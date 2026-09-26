import test from 'node:test';
import assert from 'node:assert/strict';
import { leadSchema, normalizeEgyptianPhone, buildLeadMessage } from '../src/schemas/lead';
import { appointmentSchema, FABRIC_IDS } from '../src/schemas/appointment';

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
