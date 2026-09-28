import test from 'node:test';
import assert from 'node:assert/strict';
import { rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/leads/receipt/route';
import { resetRateLimits } from '../src/lib/rate-limit';

/** صورة PNG صالحة بحجم 1×1 بكسل */
const PNG_BYTES = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

function makeRequest(file?: { name: string; type: string; bytes: Buffer }): NextRequest {
  const form = new FormData();
  if (file) {
    form.append('file', new File([new Uint8Array(file.bytes)], file.name, { type: file.type }));
  }
  return new NextRequest('http://localhost/api/leads/receipt', {
    method: 'POST',
    body: form,
  });
}

test('receipt route is public and accepts a valid PNG under receipts/', async () => {
  resetRateLimits();
  const res = await POST(makeRequest({ name: 'receipt.png', type: 'image/png', bytes: PNG_BYTES }));
  assert.equal(res.status, 200);
  const payload = await res.json();
  assert.equal(payload.ok, true);
  // يجب أن يطابق صيغة leadSchema.receiptUrl حرفياً
  assert.match(payload.url, /^\/uploads\/receipts\/.+\.png$/);

  const abs = path.join(process.cwd(), 'public', ...payload.url.split('/').slice(1));
  const info = await stat(abs);
  assert.ok(info.isFile());
  assert.equal(info.size, PNG_BYTES.length);

  await rm(abs, { force: true });
});

test('receipt route rejects missing file and non-image types', async () => {
  resetRateLimits();
  const noFile = await POST(makeRequest());
  assert.equal(noFile.status, 400);

  const exe = await POST(
    makeRequest({ name: 'evil.exe', type: 'application/x-msdownload', bytes: PNG_BYTES })
  );
  assert.equal(exe.status, 400);
  const payload = await exe.json();
  assert.match(payload.error, /نوع الملف غير مدعوم/);
});

test('receipt route rate-limits uploads at 3 per minute per IP', async () => {
  resetRateLimits();
  for (let i = 0; i < 3; i++) {
    const ok = await POST(makeRequest({ name: `r${i}.png`, type: 'image/png', bytes: PNG_BYTES }));
    assert.equal(ok.status, 200);
    const payload = await ok.json();
    const abs = path.join(process.cwd(), 'public', ...payload.url.split('/').slice(1));
    await rm(abs, { force: true });
  }
  const blocked = await POST(makeRequest({ name: 'fourth.png', type: 'image/png', bytes: PNG_BYTES }));
  assert.equal(blocked.status, 429);
  const payload = await blocked.json();
  assert.match(payload.error, /انتظر دقيقة/);
});

test('receipt route rejects oversized files', async () => {
  resetRateLimits();
  const big = Buffer.alloc(5 * 1024 * 1024 + 1, 0);
  const res = await POST(makeRequest({ name: 'big.png', type: 'image/png', bytes: big }));
  assert.equal(res.status, 400);
  const bigPayload = await res.json();
  assert.match(bigPayload.error, /5MB/);
});
