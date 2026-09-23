// L-3/#35 health-split contract tests.
// Public cases are Mongo-FREE (the route touches nothing); the admin detailed
// case needs Mongo (protect → User.findById) — Mongo-gated per repo run-book.

import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import apiRoutes from '../../routes/index.js';

// I-4 (#39): mirror the production middleware shape (server.js mounts helmet
// first) so the helmet-v8 header set is confirmed on responses — the runtime
// leg of the finding confirmable in-repo. SPA-side CSP compatibility stays a
// deploy-checklist item (browser console on first prod load).
const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);

describe('GET /api/health (public, minimal)', () => {
  it('returns 200 {status:"ok"} with zero internals', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body).toEqual({ status: 'ok' });
    // no disclosure keys
    expect(response.body).not.toHaveProperty('database');
    expect(response.body).not.toHaveProperty('memory');
    expect(response.body).not.toHaveProperty('environment');
    expect(response.body).not.toHaveProperty('uptime');
  });

  it('I-4/#39: responses carry the helmet v8 default header set', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBeDefined();
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['strict-transport-security']).toBeDefined();
  });
});

describe('GET /api/health/detailed (admin)', () => {
  it('401s without auth (no internals leak)', async () => {
    const response = await request(app).get('/api/health/detailed').expect(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('database');
  });

  // Mongo-gated: with a valid admin token returns the full depth shape
  // (status/timestamp/uptime/database/memory/version/environment, 200|503 by db).
  // Covered on a Mongo-capable desk run per the repo run-book.
});
