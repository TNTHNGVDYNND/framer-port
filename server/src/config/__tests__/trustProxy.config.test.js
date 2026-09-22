// TRUST_PROXY contract tests (drill M-1/#30; delta-review W1 + N1 landed).
//
// W1 fix shape: the parse logic is a PURE EXPORT (parseTrustProxy) and is tested
// directly — no process.env swapping, so a desk's real server/.env can never
// re-inject via dotenv on re-import (the spurious-failure mechanism the review
// flagged). The single integration case sets TRUST_PROXY explicitly: dotenv
// never overrides keys already present in the environment, so it is immune by
// construction.
//
// Contract (adjudicated):
//   "0"/"1"/"2"… → strict number hop count · unset/empty → strict false (keeps
//   express-rate-limit's forged-XFF tripwire armed) · anything else (incl.
//   parseInt-truncation forms like "1.5"/"12abc"/"0x10") → [boot] throw.

import { describe, test, expect, jest } from '@jest/globals';

const BASE = { MONGO_URI: 'mongodb://test/test', JWT_SECRET: 'test-secret' };

let parseTrustProxy;

beforeAll(async () => {
  const saved = { ...process.env };
  process.env = { ...BASE, TRUST_PROXY: '2' }; // explicit → dotenv-immune
  jest.resetModules();
  try {
    ({ parseTrustProxy } = await import('../index.js'));
  } finally {
    process.env = saved;
  }
});

describe('parseTrustProxy (pure, exported)', () => {
  test('"1" → the STRICT NUMBER 1 — never a subnet string', () => {
    const v = parseTrustProxy('1');
    expect(v).toBe(1);
    expect(typeof v).toBe('number');
  });

  test('"0" → the number 0 (valid explicit hop count)', () => {
    expect(parseTrustProxy('0')).toBe(0);
  });

  test('unset (undefined) → strict false', () => {
    expect(parseTrustProxy(undefined)).toBe(false);
  });

  test('empty / whitespace-only string → strict false', () => {
    expect(parseTrustProxy('')).toBe(false);
    expect(parseTrustProxy('   ')).toBe(false);
  });

  test('" 1 " (padded) → 1 — trim, then strict-form check', () => {
    expect(parseTrustProxy(' 1 ')).toBe(1);
  });

  test('malformed "one" → [boot] throw (fail-closed)', () => {
    expect(() => parseTrustProxy('one')).toThrow(/\[boot\] TRUST_PROXY/);
  });

  test('negative "-1" → [boot] throw', () => {
    expect(() => parseTrustProxy('-1')).toThrow(/\[boot\] TRUST_PROXY/);
  });

  // N1: parseInt-truncation edges must throw, not silently coerce —
  // "0x10" would otherwise truncate to the tripwire-silencing numeric 0.
  test.each(['1.5', '12abc', '0x10', '+1', '1e1'])(
    'truncation form %p → [boot] throw',
    (raw) => {
      expect(() => parseTrustProxy(raw)).toThrow(/\[boot\] TRUST_PROXY/);
    },
  );
});

describe('env wiring (integration, dotenv-immune)', () => {
  test('config module wires env.trustProxy from TRUST_PROXY (strict number)', async () => {
    const saved = { ...process.env };
    process.env = { ...BASE, TRUST_PROXY: '2' };
    jest.resetModules();
    try {
      const { env } = await import('../index.js');
      expect(env.trustProxy).toBe(2);
      expect(typeof env.trustProxy).toBe('number');
    } finally {
      process.env = saved;
    }
  });
});
