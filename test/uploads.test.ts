import test from 'node:test';
import assert from 'node:assert/strict';
import { rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, issueAdminSession } from '../src/lib/admin-auth';
import { POST } from '../src/app/api/admin/uploads/route';

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
  return new NextRequest('http://localhost/api/admin/uploads', {
    method: 'POST',
    body: form,
  });
}

function withSessionCookie(request: NextRequest): NextRequest {
  process.env.ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'a-super-secret-key-at-least-16-chars';
  const token = issueAdminSession('owner@sultan.store');
  assert.ok(token, 'session token should be issued');
  request.headers.set('cookie', `${ADMIN_COOKIE_NAME}=${token}`);
  return request;
}

test('uploads route rejects unauthenticated requests', async () => {
  const res = await POST(makeRequest({ name: 'a.png', type: 'image/png', bytes: PNG_BYTES }));
  assert.equal(res.status, 401);
});

test('uploads route rejects requests without a file', async () => {
  const res = await POST(withSessionCookie(makeRequest()));
  assert.equal(res.status, 400);
  const payload = await res.json();
  assert.match(payload.error, /اختر ملف صورة/);
});

test('uploads route rejects unsupported file types', async () => {
  const res = await POST(
    withSessionCookie(
      makeRequest({ name: 'evil.exe', type: 'application/x-msdownload', bytes: PNG_BYTES })
    )
  );
  assert.equal(res.status, 400);
  const payload = await res.json();
  assert.match(payload.error, /نوع الملف غير مدعوم/);
});

test('uploads route accepts a valid PNG and writes it to public/uploads', async () => {
  const res = await POST(
    withSessionCookie(makeRequest({ name: 'pixel.png', type: 'image/png', bytes: PNG_BYTES }))
  );
  assert.equal(res.status, 200);
  const payload = await res.json();
  assert.equal(payload.ok, true);
  assert.match(payload.url, /^\/uploads\/.+\.png$/);

  const abs = path.join(process.cwd(), 'public', ...payload.url.split('/').slice(1));
  const info = await stat(abs);
  assert.ok(info.isFile());
  assert.equal(info.size, PNG_BYTES.length);

  await rm(abs, { force: true });
});
