// Boot-smoke for the TRUST_PROXY parse contract (drill M-1/#30, review W3).
// Contract: integer >= 0 → hop count (strict number) · unset/empty → false
// (strict false — express-rate-limit's forged-XFF tripwire gates on === false)
// · anything else → [boot] throw (fail-closed).
// Pure env-driven: no Mongo needed — each case runs a fresh module instance.

import { describe, test, expect, jest } from '@jest/globals';

const BASE = {
  MONGO_URI: "mongodb://test/test",
  JWT_SECRET: "test-secret",
};

const load = async (trustProxy) => {
  const saved = { ...process.env };
  process.env = {
    ...BASE,
    ...(trustProxy === undefined ? {} : { TRUST_PROXY: trustProxy }),
  };
  jest.resetModules();
  try {
    return (await import("../index.js")).env.trustProxy;
  } finally {
    process.env = saved;
  }
};

describe('config trustProxy parse', () => {
  test('"1" (dotenv string) parses to the STRICT NUMBER 1 — never a subnet string', async () => {
    const v = await load("1");
    expect(v).toBe(1);
    expect(typeof v).toBe("number");
  });

  test('"0" parses to the number 0 (valid hop count)', async () => {
    expect(await load("0")).toBe(0);
  });

  test("unset → strict false (direct-serving default; keeps ERL tripwire armed)", async () => {
    expect(await load(undefined)).toBe(false);
  });

  test("empty string → strict false", async () => {
    expect(await load("")).toBe(false);
  });

  test('malformed "one" → [boot] throw (fail-closed)', async () => {
    await expect(load("one")).rejects.toThrow(/\[boot\] TRUST_PROXY/);
  });

  test('negative "-1" → [boot] throw', async () => {
    await expect(load("-1")).rejects.toThrow(/\[boot\] TRUST_PROXY/);
  });
});
