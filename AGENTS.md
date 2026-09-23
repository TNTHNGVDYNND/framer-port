# AGENTS.md

Knowledge home for framer-port. Written 2026-09-20 from verified repo state; every command and path below was checked against the checkout at time of writing.

## What this is

Interactive MERN portfolio ("Zenfolio") — a cinematic, terminal-aesthetic portfolio site with an admin-managed project list and a persisted contact form. Client: React 19 + Vite 7 + Tailwind 4 + framer-motion. Server: Express 5 + Mongoose 9 + JWT auth (login-only, admin role — registration closed, seed-provisioned). Database: MongoDB via `MONGO_URI` connection string (currently hosted on Atlas).

## How to run it

Root `npm install` cascades into both packages via `postinstall` → `install:all` — plain, no flags, safe to run as-is. (That is new: until 2026-09-20 the client leg needed `--legacy-peer-deps` because of `react-barcodes`; history and the fix live in Sharp edges #2.) Cold start:

```bash
npm install   # at root — postinstall cascades into client/ and server/
```

Dev servers (server API on :5000, client on :5173):

```bash
npm run dev            # root — both via concurrently
npm run dev:server     # server only (nodemon)
npm run dev:client     # client only (vite)
```

Seed scripts (server-side, need a reachable database):

```bash
npm run seed                      # root → server: seeds admin user (ADMIN_* env)
cd server && npm run seed:projects  # seeds projects
```

## Environment

`server/.env` is **required** — `server/src/config/database.js` connects via `mongoose.connect(process.env.MONGO_URI)` and exits (`process.exit(1)`) when the connect fails, so a missing `MONGO_URI` kills the server at boot. `client/.env` is **optional** — `VITE_API_URL` defaults to `http://localhost:5000` (`client/src/services/api.js:1`); add one only to point the client at a non-local API. Both are gitignored (root `.gitignore`); `server/.env.example` exists as the shape reference. Names and shapes only — never commit values, never paste them into docs or issues.

`server/.env` (verified against `server/src/config/index.js`, `server/server.js`, `server/scripts/seedAdmin.js`):

- `MONGO_URI` — MongoDB connection string (Atlas)
- `JWT_SECRET` — signing key. **Required — the boot gate throws without it (see Sharp edges)**
- `JWT_EXPIRES_IN` — token lifetime (defaults to `7d`)
- `PORT` — server port (defaults to `5000`)
- `CLIENT_URL` — allowed CORS origin (defaults to `http://localhost:5173`)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — consumed by `npm run seed` (the seeder refuses weak/placeholder passwords: 8+ chars, upper/lower/digit)
- `TRUST_PROXY` — proxy hops for X-Forwarded-* (integer string or unset). Unset → `false` (direct serving; forged-XFF tripwire armed); `1` behind one reverse proxy. Malformed values fail the boot gate (see Sharp edges).

`client/.env` (verified against `client/src/services/api.js`):

- `VITE_API_URL` — API base URL (defaults to `http://localhost:5000`)

## Testing

```bash
npm test   # root → server: NODE_ENV=test node --experimental-vm-modules jest --coverage
```

- The `--experimental-vm-modules` flag is **required**: the server is ESM and `jest.setup.js` runs untransformed. Don't drop it.
- Tests need a reachable MongoDB: `jest.setup.js` connects to `MONGO_URI` with the database name swapped to `test-framer-port`, falling back to `mongodb://localhost:27017/test-framer-port`. `mongodb-memory-server` is a devDependency but is **not wired into the setup file**.
- Known state (2026-09-19): **14 test failures parked as "test suite reconciliation"**. Causes:
  - List-endpoint assertions are stale vs the API's `{success, count, data}` envelope — e.g. `server/src/controllers/__tests__/projectController.test.js` asserts `response.body` is a raw array.
  - An E11000 duplicate-key isolation issue between tests.
  - Mongoose `new: true` deprecation in updates — wants `returnDocument: 'after'`.
- `mongodb-memory-server` and `@parcel/watcher` have postinstall scripts blocked by the npm install-scripts guard. Approve them individually (e.g. `npm approve-builds`) when their features are actually needed.

## API conventions

- Base path `/api`; health check at `GET /api/health`.
- List endpoints return the envelope `{success: true, count, data}` (projects, users, contact messages). Single-resource `GET` returns the raw document (no envelope). Write responses vary by endpoint: `POST`/`PUT /projects` and `PATCH /contact/:id/read` return `{success, message, data}`; `POST /contact` returns `{message, id}` (contactController.js:25-28); `POST /users/login` returns `{_id, email, role}` — the JWT rides an HttpOnly cookie, never the body (M-2); `POST /users/logout` returns `{message}`; `DELETE /projects/:id` returns `{success, message, id}` (projectController.js:105-109). Errors: `{message}` bodies come from controllers/middleware directly; the central error handler emits `{error}` or `{error, details}`.
- Auth: `Authorization: Bearer <JWT>` (`protect` middleware); admin-only routes additionally require the user's `role === 'admin'` (`adminOnly`).
- Rate limiting (`express-rate-limit`, standard `RateLimit-*` headers): general API 100 req/15 min, auth endpoints 5/15 min, contact form 3/hour. **Trust proxy** (M-1/#30): `server.js` sets `app.set('trust proxy', env.trustProxy)` — parsed from `TRUST_PROXY` (integer hop count; unset → `false`; malformed → fail-closed boot throw). Behind a reverse proxy, set it to the real hop count or every client shares the proxy's IP and the auth limits go global.
- Read endpoints are cached in-process (`node-cache`): projects list 600s, project detail 300s, users 300s, contact messages 120s; write operations clear the affected keys.

## Sharp edges

1. **JWT_SECRET fallback — FIXED (2026-09-20, `07533ce`+`71a588b`):** a fail-closed boot gate now throws at module load if `JWT_SECRET` or `MONGO_URI` is missing, empty, or whitespace — before the server listens, before any token is signed. The old hardcoded fallback is gone (originally flagged by a fleet-side security review; the review artifact is not in this repo). Design note: config modules throw; the entry point owns process death — rationale in `server/src/config/index.js` comments. Dev impact: `server/.env` with real values is mandatory — the app refuses to boot without them, by design.
2. **`react-barcodes` ERESOLVE peer trap — FIXED (2026-09-20, branch `op/2026-0920-barcode-replacement`):** the deprecated `react-barcodes@1.2.0` declared peer `react@^17` / `react-dom@^17` against this repo's React 19, so any plain install touching the client could die with ERESOLVE — and because root `postinstall` → `install:all` re-runs the client leg on every root install, the `--legacy-peer-deps` flag (or root `--ignore-scripts`) had to be remembered forever. The fix: `client/src/components/Barcode.jsx` calls `jsbarcode` directly — the same underlying engine `react-barcodes` wrapped, so the rendered bars are identical by construction. Sequencing: the code change rides the branch above; the `package.json`/lockfile swap (`cd client && npm uninstall react-barcodes && npm install jsbarcode`) lands with the Captain's test sequence on that branch. `jsbarcode@3.12.x` was already in the lockfile as the wrapper's transitive dep, so the import resolves as soon as the swap runs. After it, plain root `npm install` is the only install command anyone needs.
3. **Docker/CI artifacts are `.disabled`** — `docker-compose.prod.yml.disabled` (root), `server/Dockerfile.disabled`, `.github/workflows/{ci,deploy}.yml.disabled`; root `docker:*` scripts echo placeholders. *(Updated 2026-09-22, #28/#29: the stale `server/.dockerignore.disabled` twin was deleted — superseded by the curated `server/.dockerignore` which is ACTIVE and must never be overwritten by a rename; the deploy workflow is `workflow_dispatch`-only, so a rename cannot re-arm auto-deploy; compose no longer publishes Mongo on any host interface.)* Re-enabling checklist: rename the three artifacts (compose references `Dockerfile`, not `Dockerfile.disabled`), restore the root `docker:*` scripts, keep the existing `server/.dockerignore` exactly as-is (it already guards the Dockerfile's `COPY . .` against baking `.env` — secrets — into the image), and verify port bindings (server defaults to `:5000`; Mongo is `expose`-only on the internal network — no host publish by design; do not re-add one without a recorded reason).
4. **Dependency refresh 2026-09-19/20** — both lockfiles were regenerated (delete + reinstall commits), taking `npm audit` from 14 vulnerabilities to 0. Re-run the audit after any dependency change (the barcode swap in Sharp edges #2 is exactly such a change).

## Repo map

- `client/` — React 19 + Vite SPA (`src/` app code, `src/services/api.js` API client, `src/context/AuthProvider.jsx` auth state)
- `server/` — Express API (`src/config`, `src/controllers`, `src/middleware`, `src/models`, `src/routes`; `scripts/` seeds; `jest.config.js` / `jest.setup.js`)
- `docs/` — project history: numbered phase docs (`01-`…`11-`), `codebase.md`, `decisions.md`, `security-assessment.md` (historical 2026-03-31 report — its findings are since fixed; read as history, not current state), `verification-report.md`
- `references/` — design reference images
- `documents/` — gitignored local docs (not on remote)
- `.github/workflows/*.disabled` — disabled CI
- `README.md` — product overview and quick start

## Workflow

All changes ride branches; `main` never takes a direct commit from any desk. Crew work lands via `op/*` branches through the fleet pipeline (review before landing); hand edits ride short-lived `fix/*` or `docs/*` branches. `main` moves only by the Captain's local merge (`--no-ff` for hand edits keeps a visible labeled merge point) followed by push. The remote is the shared truth between desks.

## Maintaining this file

The authoritative copy is this file, `AGENTS.md` at the repo root. Prefer rewriting or pruning over appending; only knowledge useful to almost every future session belongs here. Deep history lives in `docs/` — link to it, don't duplicate it.
