import test from 'node:test';
import assert from 'node:assert/strict';
import {
  issueAdminSession,
  verifyAdminSession,
  verifyPassword,
} from '../src/lib/admin-auth';

test('verifyPassword compares strings accurately', () => {
  assert.equal(verifyPassword('Secret1234', 'Secret1234'), true);
  assert.equal(verifyPassword('Secret1234', 'Wrong12345'), false);
  assert.equal(verifyPassword('Secret1234', 'secret1234'), false);
});

test('session flow with ADMIN_SESSION_SECRET env configured', () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = 'a-super-secret-key-at-least-16-chars';

  try {
    const token = issueAdminSession('owner@sultan.store');
    assert.equal(typeof token, 'string');
    if (token) {
      assert.match(token, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);

      const email = verifyAdminSession(token);
      assert.equal(email, 'owner@sultan.store');

      // Tampered token fails
      const parts = token.split('.');
      assert.equal(verifyAdminSession(`${parts[0]}tampered.${parts[1]}`), null);
    }

    // Invalid tokens
    assert.equal(verifyAdminSession('garbage'), null);
    assert.equal(verifyAdminSession(''), null);
    assert.equal(verifyAdminSession(null), null);
  } finally {
    process.env.ADMIN_SESSION_SECRET = originalSecret;
  }
});
