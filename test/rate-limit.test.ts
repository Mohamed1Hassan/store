import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit, resetRateLimits } from '../src/lib/rate-limit';

test('rate limit allows requests within limit and blocks excess', async () => {
  resetRateLimits();
  const ip = '192.168.1.1';

  // 5 requests allowed
  for (let i = 0; i < 5; i++) {
    const res = await checkRateLimit(ip, 5, 60_000);
    assert.equal(res.allowed, true, `Request ${i + 1} should be allowed`);
    assert.equal(res.remaining, 4 - i);
  }

  // 6th request blocked
  const blocked = await checkRateLimit(ip, 5, 60_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);

  // Different IP is allowed
  const other = await checkRateLimit('10.0.0.1', 5, 60_000);
  assert.equal(other.allowed, true);
  assert.equal(other.remaining, 4);

  resetRateLimits();
});
