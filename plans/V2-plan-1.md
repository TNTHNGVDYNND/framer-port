# V2 Implementation Plan — Frontend (Client) Only

> Scope: `client/src` only. No backend changes in this plan.
> Policy: behavior-preserving unless noted. Each phase is independently verifiable with `npm run lint && npm run build`.
> Delivery: one PR per phase, small reviewable diffs.

**STATUS: ✅ ALL PHASES COMPLETE** — `feature/refactor-fe-v2`, commits `f171b7a` → `fa6c0e6`
Lint baseline: 58 errors / 8 warnings (pre-existing). Build: ✓ 502 modules, ~399 kB JS.

---

## Baseline (run before anything else)

```bash
cd client
npm run lint   # note any pre-existing warnings
npm run build  # capture bundle sizes: JS + CSS kB
```

Manual smoke check on all 4 pages (Home / About / Work / Contact):

- Theme toggle (light ↔ dark)
- Terminal headers render with 3 traffic-light dots
- Blinking cursor visible in ContactForm, TerminalLoader, MiniTerminal
- Contact form progresses through idle → submitting → success
- Project cards tilt on mouse-move
- CustomScrollbar thumb tracks scroll position
- Navbar active-link indicator slides correctly

Save these numbers. Every phase must pass lint + build and not regress this checklist.

---

## Phase 1 — DRY: Extract Repeated UI Primitives & Hooks ✅ COMPLETE

**Goal:** Remove the 7 copy-paste patterns identified without changing any visible behavior, and capture repeated Framer Motion configs into a single preset file. Each item is independently extractable.

> **Tailwind v4 note:** This project uses Tailwind CSS v4.1.17. Token mapping is done exclusively via the `@theme` directive in `client/src/styles/`. `tailwind.config.js` exists only for `content` and `darkMode` configuration and must **not** receive `theme.extend` entries.

### 1-A `TerminalHeader` component ✅

**Implemented:** `client/src/components/TerminalHeader.jsx` (later moved to `primitives/` in Phase 4-A).
Props: `filename`, `className`, `labelClassName`. Migrated all 7 consumers.

---

### 1-B `BlinkingCursor` component ✅

**Implemented:** `client/src/components/BlinkingCursor.jsx` (later moved to `primitives/` in Phase 4-A).
Props: `duration`, `className`, `style`. Migrated ContactForm, TerminalLoader, MiniTerminal.

---

### 1-C `useTerminalOutput` hook ✅

**Implemented:** `client/src/hooks/useTerminalOutput.js`. Returns `{ output, addLine, addLines, clear, setOutput }`. Line shape `{ text, type, id }`. Exported from `hooks/index.js`. Migrated ContactForm, TerminalLoader, MiniTerminal.

Export from `hooks/index.js`. Migrate 3 files. Zero behavioral change.

---

### 1-D `useProgressSimulation` hook ✅

**Implemented:** `client/src/hooks/useProgressSimulation.js`. Signature matches plan. Exported from `hooks/index.js`. Migrated ContactForm, ResumeDownload.

---

### 1-E `use3DTilt` hook ✅

**Implemented:** `client/src/hooks/use3DTilt.js`. Added `elementRelative` option and exposes `isHovered`. Migrated Hero (window-relative) and ProjectCard (`elementRelative: true`). Exported from `hooks/index.js`.

---

### 1-F `useAsyncOperation` hook ✅

**Implemented:** `client/src/hooks/useAsyncOperation.js`. Auto-run via `deps` option. Used eslint-disable block around `useEffect` for exhaustive-deps. Exported from `hooks/index.js`. BlogSection migrated.

---

### 1-G `motionPresets.js` — Framer Motion config constants ✅

**Implemented:** `client/src/utils/motionPresets.js`. All 11 exports present. Imported in BlogSection, WorkHero, ProjectCard, Hero, TerminalLoader, Navbar.

---

### Phase 1 verification

```bash
npm run lint && npm run build
```

- Bundle size should be equal or smaller (no new deps, only extraction).
- Full manual smoke check passes.
- `hooks/index.js` now exports: `useDarkMode`, `useInView`, `useMousePosition`, `useScrollVelocity`, `useTerminalOutput`, `useProgressSimulation`, `use3DTilt`, `useAsyncOperation`.
- `utils/motionPresets.js` exists and is imported (not re-declared inline) in at least `ProjectCard`, `Hero`, `WorkHero`.

---

## Phase 2 — Style System: Token Audit + CSS Primitives ✅ COMPLETE

**Goal:** All semantic design tokens live exclusively in `client/src/styles/` via the `@theme` directive (Tailwind v4 architecture). In Tailwind v4, CSS variables declared inside `@theme` are automatically surfaced as Tailwind utilities — no JS config needed. This phase audits gaps in `theme.css`, improves the light theme's visual quality, and adds reusable structural CSS classes.

> **Architecture rule:** `tailwind.config.js` only holds `content` glob and `darkMode` strategy. Never add `theme.extend` here. All token additions go into `theme.css` inside the `@theme` block.

### 2-A Audit and complete `theme.css` token coverage ✅

**Implemented:** All required tokens confirmed present in `@theme`. No missing tokens found.

---

### 2-A2 Light theme warm cream base improvement ✅

**Implemented:** Added `--color-base-100/200/300` and `--color-accent-glow` to `@theme`. Updated `--light-bg-body → var(--color-base-100)` and `--color-card-bg → var(--color-base-200)`. Dark theme `--color-bg-body` override confirmed unaffected.

---

### 2-B Terminal window shell classes in `components.css` ✅

**Implemented:** Added `.terminal-window`, `.terminal-window__header`, `.terminal-window__body`, `.terminal-status`, `.terminal-status__dot`, `.terminal-output-line` + 6 type modifiers (`--command/system/success/error/info/easter`). `.terminal-window` sets `border-color: var(--color-border-color)` as default, `.terminal-window__header` similarly. `TerminalHeader` dots migrated to `.terminal-status__dot`. All 5 consumer components migrated.

---

### 2-C Inline style migration pass ✅

**Implemented:** All 7 priority components migrated (BlogSection → 0 remaining, ResumeDownload → 1, ContactForm → 5 dynamic, MiniTerminal → 3 borderColor overrides, CareerTimeline → 3 dynamic+MotionValue, TerminalSkills → 6 dynamic+textShadow+gradient, WorkHero → 1 dynamic).

**Rules applied:**

- Static `var(--color-X)` → `text-X` / `bg-X` / `border-X`
- Dynamic conditionals (`isDownloading ?`, `status ===`, `phase.color`, `activeFilter ===`, `isFocused ?`) → kept as `style=`
- Framer Motion MotionValues (`pathLength`) → kept as `style=`
- `boxShadow`, `textShadow`, `backgroundImage: linear-gradient()` → kept as `style=`
- `.terminal-window` default `borderColor` → removed (CSS class handles it); intentional overrides kept

---

### 2-D `background-effects.css` — wire grain overlay ✅

**Implemented:** `<div className='grain-overlay' aria-hidden='true' />` added after the global background layer in `Layout.jsx`. Added `@media (prefers-reduced-motion: reduce) { .grain-overlay { display: none; } }` to `background-effects.css`.

---

### 2-E `utilities.css` — duration tokens + focus normalization ✅

**Implemented:**

- `--duration-fast: 150ms`, `--duration-normal: 300ms`, `--duration-slow: 500ms` added to `theme.css` `@theme` block → Tailwind generates `duration-fast`, `duration-normal`, `duration-slow` utilities
- `.focus-ring-invert` (outline: coral) added to `utilities.css`
- `.focus-ring` applied to: ContactForm submit button, ResumeDownload download + QR toggle buttons, WorkHero filter buttons, MiniTerminal command input
- Navbar already had `focus:ring-2 focus:ring-lagoon` (pre-existing, left as-is)

---

### Phase 2 verification

```bash
npm run lint && npm run build
```

- Bundle CSS should shrink (inline styles moved to classes, dead `.grain-overlay` resolved).
- All 50+ inline `style={{ color: … }}` occurrences either replaced with Tailwind classes or documented as intentionally remaining (Framer Motion MotionValues).
- Both light and dark theme render correctly across all 4 pages.
- Light theme body background is warm cream (`oklch(98% 0.01 90)`), not dated tan. Dark theme is unaffected.
- Text contrast passes WCAG AA on light cream background.
- No FOUC or flicker introduced by token changes.
- Keyboard focus rings visible and consistent across Navbar, buttons, inputs.
- Duration token utilities (`duration-fast`, etc.) work in class names.

---

## Phase 3 — Frontend API Client + Error Boundary ✅ COMPLETE

**Goal:** Give the frontend a stable data layer so components don't own fetch logic directly, and add a safety net for runtime errors.

### 3-A `services/api.js` ✅

**Implemented:** `client/src/services/api.js`. Uses `import.meta.env.VITE_API_URL || 'http://localhost:3001/api'`. All 3 methods: `api.projects.getAll()`, `api.contact.submit(data)`, `api.blog.getPosts(username, n)`. Throws on non-2xx via internal `request()` helper.

---

### 3-B Migrate `BlogSection.jsx` to `useAsyncOperation` + `api.blog` ✅

**Implemented:** Replaced inline `fetch('https://dev.to/api/articles?...')` with `api.blog.getPosts('tvatdci', 5)`. Import from `../services` barrel. `useAsyncOperation` was already in place from Phase 1-F.

---

### 3-C `ErrorBoundary` component ✅

**Implemented:** `client/src/components/ErrorBoundary.jsx`. Class component with `getDerivedStateFromError` + `componentDidCatch`. Terminal-themed fallback: coral ASCII error banner, monospace, reload button with `.focus-ring`. Wrapped `<AppRoutes />` in `App.jsx`.

---

### Phase 3 verification

```bash
npm run lint && npm run build
```

- `BlogSection` renders posts correctly (network call still hits dev.to).
- Artificially throwing an error inside a route renders the ErrorBoundary fallback, not a blank screen.
- No other component behavior changed.
- `VITE_API_URL` can be overridden via `.env.local`.

---

## Phase 4 — Organization: Shared Primitives Folder ✅ COMPLETE

**Goal:** Establish the `shared/` structure for the extracted primitives so future features know where to add new components/hooks without dumping everything in `components/`.

### 4-A Create `components/primitives/` folder ✅

**Implemented:** `TerminalHeader.jsx` and `BlinkingCursor.jsx` moved to `components/primitives/`. All 7 consumer import paths updated (`./TerminalHeader` → `./primitives/TerminalHeader`, etc.).

---

### 4-B Confirm `hooks/` barrel is complete ✅

**Implemented:** `hooks/index.js` exports all 8 planned hooks plus `usePrefersReducedMotion` and `usePerformanceMetrics` (also exported from `useInView.js`). All 10 files that previously imported hooks directly from their file paths updated to import from `../hooks` barrel — including `ThemeProvider.jsx`, `Layout.jsx`, `ProjectGrid.jsx`, `ProjectCard.jsx`, `Hero.jsx`.

---

### 4-C `services/` barrel ✅

**Implemented:** `client/src/services/index.js` — `export * from './api'`. BlogSection imports `{ api }` from `'../services'` barrel.

---

### Phase 4 verification ✅

```bash
npm run lint && npm run build
```

- ✅ No broken import paths.
- ✅ `components/primitives/` imports resolve everywhere (502 modules transformed).
- ✅ Lint baseline: 58 errors / 8 warnings (all pre-existing `react/no-unescaped-entities` + prop-types, none introduced).

---

## Summary: What Gets Created / Modified

### New files

```
client/src/components/TerminalHeader.jsx        (Phase 1-A → moved to primitives/ in Phase 4)
client/src/components/BlinkingCursor.jsx        (Phase 1-B → moved to primitives/ in Phase 4)
client/src/components/primitives/               (Phase 4-A)
client/src/components/ErrorBoundary.jsx         (Phase 3-C)
client/src/hooks/useTerminalOutput.js           (Phase 1-C)
client/src/hooks/useProgressSimulation.js       (Phase 1-D)
client/src/hooks/use3DTilt.js                   (Phase 1-E)
client/src/hooks/useAsyncOperation.js           (Phase 1-F)
client/src/utils/motionPresets.js               (Phase 1-G)
client/src/services/api.js                      (Phase 3-A)
client/src/services/index.js                    (Phase 4-C)
```

### Modified files

```
client/tailwind.config.js                       (NO CHANGE — content/darkMode only; never extend here)
client/src/styles/theme.css                     (Phase 2-A — audit @theme tokens; Phase 2-A2 — warm cream light theme; add duration tokens)
client/src/styles/components.css                (Phase 2-B — terminal window classes)
client/src/styles/utilities.css                 (Phase 2-E — focus normalization; duration token note)
client/src/styles/background-effects.css        (Phase 2-D — wire grain overlay or remove)
client/src/App.jsx                              (Phase 3-C — wrap with ErrorBoundary)
client/src/hooks/index.js                       (Phase 1-C–F — new hook exports)
client/src/components/ContactForm.jsx           (Phase 1-A,B,C,D / Phase 2-C)
client/src/components/TerminalLoader.jsx        (Phase 1-A,B,C / Phase 2-C)
client/src/components/MiniTerminal.jsx          (Phase 1-A,B,C / Phase 2-B,C)
client/src/components/ResumeDownload.jsx        (Phase 1-A,D / Phase 2-B,C)
client/src/components/BlogSection.jsx           (Phase 1-F / Phase 2-C / Phase 3-B)
client/src/components/WorkHero.jsx              (Phase 1-A,G / Phase 2-B,C)
client/src/components/CareerTimeline.jsx        (Phase 1-A / Phase 2-C)
client/src/components/Hero.jsx                  (Phase 1-E,G / Phase 2-C)
client/src/components/ProjectCard.jsx           (Phase 1-E,G / Phase 2-C)
client/src/components/TerminalSkills.jsx        (Phase 2-C)
```

### Excluded from this plan (deferred)

- Full TypeScript migration
- Global state library (Zustand/Redux)
- Feature-folder (features/\*) large-scale restructuring
- Backend changes (separate plan)
- Testing setup (separate phase, after all 4 phases above are stable)
