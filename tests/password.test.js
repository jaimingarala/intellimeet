const test = require('node:test');
const assert = require('node:assert/strict');

const { hashPassword, verifyPassword } = require('../apps/api/src/utils/password');

test('hashPassword produces a verifiable password hash', () => {
  const hash = hashPassword('Password123!');

  assert.equal(typeof hash, 'string');
  assert.equal(verifyPassword('Password123!', hash), true);
  assert.equal(verifyPassword('wrong-password', hash), false);
});

test('verifyPassword rejects malformed stored hashes', () => {
  assert.equal(verifyPassword('Password123!', 'not-a-valid-hash'), false);
});
