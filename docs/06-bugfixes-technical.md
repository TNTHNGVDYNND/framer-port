# Bug Fixes & Technical Decisions

## 1. Lenis Smooth Scroll Exposure

### Issue
`useScrollVelocity.js` tried to access `window.lenis` but it wasn't exposed.

### Solution
Added `window.lenis = lenis` in `main.jsx`:

```jsx
const lenis = new Lenis({ duration: 1.2 });
window.lenis = lenis;  // Expose for hooks

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

## 2. CustomScrollbar .get() Warning

### Issue
Using `.get()` on MotionValue during render causes React warnings:
```jsx
value={scrollYProgress.get() * 100}  // ❌ Warning
```

### Solution
Use `useTransform` and `defaultValue`:

```jsx
const thumbY = useTransform(
  scrollYProgress,
  [0, 1],
  ["0%", "calc(100vh - 48px)"]
);

// Range input
<input 
  defaultValue={0}  // ✅ Not value={...get()}
  onChange={handleSliderChange}
/>
```

## 3. Barcode Dependency Issue

### Issue
`react-barcodes` v1.2.0 is deprecated. NPM warns but package still works.

### Status
- Package continues to function
- Long-term: Consider migration to `next-barcode`
- See `documents/BARCODE-ISSUE-EXPLANATION.md` for details

## 4. Language Toggle Removed

### Decision
User decided to use English only for simplicity.

### Files Removed
- `LanguageContext.jsx` - Deleted
- `LangToggle.jsx` - Deleted
- Translations not needed

## 5. WebGL Deprecated

### Attempted
- Installed @react-three/fiber, drei, three.js
- Created FluidShader with simplex noise
- WebGLBackground component

### Issues Encountered
- WebGL context lost errors
- Bundle size: 1,380 kB (too large)
- Shader complexity too heavy

### Decision
- Reverted to CSS-only approach
- Bundle reduced to 492 kB
- Background effects via CSS (grain, blur, gradients)

## 6. Backend Contact Form Refactor

### Original
- Contact controller was placeholder (logged to console)
- Frontend used setTimeout simulation

### Planned (Not Completed)
- Create Contact Mongoose model
- Implement real database persistence
- Connect frontend to real API endpoint

### Status
**PENDING** - Server-side work in progress

## 7. Server Port Alignment

### Issue (DISCOVERED)
- `server/server.js` line 12: `const PORT = process.env.PORT || 5000;`
- `client/src/services/api.js`: `baseURL: 'http://localhost:3001'` (defaults to wrong port)
- Frontend cannot connect to backend due to port mismatch

### Source Files
- `server/server.js:12` - Port configuration
- `client/src/services/api.js` - API base URL

### Planned Fix
- Update `client/src/services/api.js` to use port 5000
- Or set `VITE_API_URL` environment variable
- Uncomment MongoDB connection in `server/server.js:23-30`

### Status
**PENDING** - Needs immediate fix for backend integration

## 2026-09 Security & Hygiene Drill — annotation

The 2026-09-22/23 cross-desk drill (server-side security findings, one-finding-per-PR,
cross-desk review, human-gated merges) is documented in the repo `AGENTS.md` (Sharp edges)
and the PR trail (#29, #41–#49). Client-side items from that arc recorded here:

- **Dependency refresh (this doc's domain):** client `npm audit fix` 2026-09-23 — 14
  vulnerabilities (10 high: react-router/-dom, vite, postcss) → **0**, all semver-compatible
  bumps, production build verified (brotli assets emitted).
- **401 session handling:** `api.js` request layer now reloads once on 401 (session gone /
  revoked / force-logged-out) instead of surfacing error toasts — the fresh page
  re-bootstraps auth into the guest state. Loop-guarded via sessionStorage.
