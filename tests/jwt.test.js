const test = require('node:test');
const assert = require('node:assert/strict');

const { signToken, verifyToken } = require('../apps/api/src/utils/jwt');

const SECRET = 'unit-test-secret';

function withMockedNow(nowMs, fn) {
  const originalNow = Date.now;
  Date.now = () => nowMs;
  try {
    return fn();
  } finally {
    Date.now = originalNow;
  }
}

test('signToken and verifyToken round-trip payload claims', () => {
  withMockedNow(1_700_000_000_000, () => {
    const token = signToken({ sub: 'user-1', type: 'access' }, SECRET, 60);
    const payload = verifyToken(token, SECRET);

    assert.equal(payload.sub, 'user-1');
    assert.equal(payload.type, 'access');
    assert.equal(payload.iat, 1_700_000_000);
    assert.equal(payload.exp, 1_700_000_060);
  });
});

test('verifyToken rejects tampered signatures', () => {
  withMockedNow(1_700_000_000_000, () => {
    const token = signToken({ sub: 'user-2', type: 'refresh' }, SECRET, 60);
    const parts = token.split('.');
    const tampered = `${parts[0]}.${parts[1]}.broken-signature`;

    assert.throws(() => verifyToken(tampered, SECRET), /Invalid token signature/);
  });
});

test('verifyToken rejects expired tokens', () => {
  withMockedNow(1_700_000_000_000, () => {
    const token = signToken({ sub: 'user-3', type: 'access' }, SECRET, 1);

    withMockedNow(1_700_000_002_000, () => {
      assert.throws(() => verifyToken(token, SECRET), /Token expired/);
    });
  });
});
