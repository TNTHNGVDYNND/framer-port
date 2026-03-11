# V2 Implementation Plan — Frontend (Client) Only

> Scope: `client/src` only. No backend changes in this plan.
> Policy: behavior-preserving unless noted. Each phase is independently verifiable with `npm run lint && npm run build`.
> Delivery: one PR per phase, small reviewable diffs.

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

## Phase 1 — DRY: Extract Repeated UI Primitives & Hooks

**Goal:** Remove the 7 copy-paste patterns identified without changing any visible behavior, and capture repeated Framer Motion configs into a single preset file. Each item is independently extractable.

> **Tailwind v4 note:** This project uses Tailwind CSS v4.1.17. Token mapping is done exclusively via the `@theme` directive in `client/src/styles/`. `tailwind.config.js` exists only for `content` and `darkMode` configuration and must **not** receive `theme.extend` entries.

### 1-A `TerminalHeader` component

**Why:** The traffic-light header block (`● ● ●` + filename) is copy-pasted in:
`ContactForm`, `WorkHero`, `ResumeDownload`, `CareerTimeline`, `TerminalLoader`, `MiniTerminal`, `BlogSection` (7 files).

**New file:** `client/src/components/TerminalHeader.jsx`

```
Props:
  filename  string   shown after the dots   default: "process.exe"
  className string   extra wrapper classes   default: ""
```

Replace all 7 usages. Zero visual change.

---

### 1-B `BlinkingCursor` component

**Why:** `<motion.span animate={{ opacity: [1,0] }} transition={{ duration:0.8, repeat:Infinity }} …>` exists in `ContactForm`, `TerminalLoader`, `MiniTerminal`.

**New file:** `client/src/components/BlinkingCursor.jsx`

```
Props:
  duration  number   blink interval (s)    default: 0.8
  className string   size + color classes  default: "w-2 h-4 bg-lagoon"
```

Replace all 3 usages. Zero visual change.

---

### 1-C `useTerminalOutput` hook

**Why:** The `[output, setOutput]` state + `addLine(text, type)` mutation pattern is duplicated in `ContactForm`, `TerminalLoader`, `MiniTerminal`.

**New file:** `client/src/hooks/useTerminalOutput.js`

```
Returns: { output, addLine(text, type), addLines(lines[]), clear, setOutput }
Line shape: { text, type, id }
Types: 'info' | 'system' | 'success' | 'error' | 'command' | 'easter'
```

Export from `hooks/index.js`. Migrate 3 files. Zero behavioral change.

---

### 1-D `useProgressSimulation` hook

**Why:** `setInterval` incrementing progress 0→100 and calling a callback on completion is duplicated in `ContactForm` and `ResumeDownload`.

**New file:** `client/src/hooks/useProgressSimulation.js`

```
Signature: useProgressSimulation(onComplete, { increment = 10, interval = 200 })
Returns:   [progress, startSimulation, reset]
```

Export from `hooks/index.js`. Migrate 2 files. Zero behavioral change.

---

### 1-E `use3DTilt` hook

**Why:** `useMotionValue(0)` × 2 + `useSpring(useTransform(…))` × 2 + `handleMouseMove` + `handleMouseLeave` is duplicated in `Hero.jsx` and `ProjectCard.jsx` with slightly different spring configs.

**New file:** `client/src/hooks/use3DTilt.js`

```
Signature: use3DTilt({ stiffness, damping, rotationRange, mouseRange, disabled })
Returns:   { rotateX, rotateY, mouseX, mouseY, handleMouseMove, handleMouseLeave }
Defaults:  stiffness=150, damping=20, rotationRange=8, mouseRange=[-0.5, 0.5]
```

Export from `hooks/index.js`. Migrate `Hero` (uses window-relative coords) and `ProjectCard` (uses element-relative coords — pass `elementRelative: true`). Verify tilt behavior unchanged in both.

---

### 1-F `useAsyncOperation` hook

**Why:** `{ loading, error, data }` state + try/catch + isMounted guard is duplicated in `BlogSection` (fetch posts) and partially in `ContactForm` (submit).

**New file:** `client/src/hooks/useAsyncOperation.js`

```
Signature: useAsyncOperation(asyncFn, deps)
Returns:   { loading, error, data, success, run }
```

Export from `hooks/index.js`. Migrate `BlogSection`. `ContactForm` uses `run` manually (submit-triggered, not auto-run on mount).

---

### 1-G `motionPresets.js` — Framer Motion config constants

**Why:** `whileHover={{ scale: 1.05 }}`, `transition={{ duration: 0.3, ease: 'easeOut' }}`, spring configs, and `staggerChildren` values are repeated across 10+ files with no single source of truth.

**New file:** `client/src/utils/motionPresets.js`

```
Exports (plain objects — not hooks, no React dependency):

  HOVER_SCALE       { whileHover: { scale: 1.05 }, whileTap: { scale: 0.97 } }
  HOVER_LIFT        { whileHover: { y: -4, scale: 1.02 } }
  FADE_UP           variants: hidden { opacity:0, y:20 } → visible { opacity:1, y:0 }
  FADE_IN           variants: hidden { opacity:0 }       → visible { opacity:1 }
  STAGGER_CONTAINER variants: visible { staggerChildren: 0.08 }
  STAGGER_SLOW      variants: visible { staggerChildren: 0.15 }
  SPRING_SOFT       { type:'spring', stiffness:150, damping:20 }
  SPRING_SNAPPY     { type:'spring', stiffness:300, damping:30 }
  TRANSITION_FAST   { duration:0.15, ease:'easeOut' }
  TRANSITION_NORMAL { duration:0.3,  ease:'easeOut' }
  TRANSITION_SLOW   { duration:0.5,  ease:'easeInOut' }
```

Rule: only plain serialisable objects here — no hooks or components. Import and spread into Framer Motion props (`...HOVER_SCALE`, `variants={FADE_UP}`, `transition={SPRING_SOFT}`). These are composable, never opinionated about DOM structure.

Migrate highest-density files first: `ProjectCard`, `Hero`, `WorkHero`, `BlogSection`, `Navbar`.

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

## Phase 2 — Style System: Token Audit + CSS Primitives

**Goal:** All semantic design tokens live exclusively in `client/src/styles/` via the `@theme` directive (Tailwind v4 architecture). In Tailwind v4, CSS variables declared inside `@theme` are automatically surfaced as Tailwind utilities — no JS config needed. This phase audits gaps in `theme.css`, improves the light theme's visual quality, and adds reusable structural CSS classes.

> **Architecture rule:** `tailwind.config.js` only holds `content` glob and `darkMode` strategy. Never add `theme.extend` here. All token additions go into `theme.css` inside the `@theme` block.

### 2-A Audit and complete `theme.css` token coverage

**Current state:** `theme.css` declares semantic variables (`--color-heading`, `--color-lagoon`, `--font-dune`, etc.) inside `@theme`. Tailwind v4 auto-generates utilities from these (`text-heading`, `bg-lagoon`, `font-dune` etc.).

**Problem:** Several semantic variables are missing or inconsistently named, causing components to fall back to inline `style={{ color: 'var(--color-X)' }}` objects (50+ occurrences).

**Action — verify and add any missing tokens to `theme.css` `@theme` block:**

```
Required in @theme (confirm or add):
  --color-heading        (already present)
  --color-sub-title      (already present)
  --color-text-primary   (already present)
  --color-text-secondary (already present)
  --color-text-accent-alt
  --color-muted-text
  --color-primary-accent
  --color-secondary-accent
  --color-highlight
  --color-border-color
  --color-card-bg
  --color-lagoon         (check presence in colors.css → theme.css mapping)
  --color-coral          (check presence)
  --color-dusk           (check presence)
  --color-bg-body
  --color-bg-t
  --color-bg-md
  --color-bg-b
  --font-dune            (already present)
  --font-zodiak          (already present)
  --font-mono            (already present)
  --font-display         (already present)
```

Once confirmed present in `@theme`, Tailwind v4 auto-generates: `text-heading`, `bg-card-bg`, `border-border-color`, `font-dune`, etc. No JS config change required.

**Do NOT replace inline styles yet in this step** — verify token existence first. Migration in 2-C.

---

### 2-A2 Light theme warm cream base improvement

**Current state:** Light theme body background is `--light-bg-body: var(--color-driftwood)` which resolves to `#d2b690` — a dated tan/beige that lacks the warm cream sophistication described in `UI-FE-V1.md`.

**Action — update these three tokens inside the `@theme` block in `theme.css`:**

```css
/* Light theme base — warm white/cream */
--color-base-100: oklch(98% 0.01 90); /* Warm white — lightest surface */
--color-base-200: oklch(96% 0.015 85); /* Warm cream — secondary surface */
--color-base-300: oklch(93% 0.02 80); /* Warm sand — card/panel bg */

/* Midnight Sun glow accent */
--color-accent-glow: oklch(
  70% 0.15 40
); /* Warm amber-orange for hero radial glow */

/* Update light theme background mapping */
--light-bg-body: var(--color-base-100); /* replaces --color-driftwood */
--color-bg-body: var(--light-bg-body); /* ensure cascade is correct */
--color-card-bg: var(--color-base-200); /* replaces old okch card-bg */
```

Also update `[data-theme='dark']` to ensure dark theme body background is **not** affected by this change (it already overrides `--color-bg-body` independently — verify this is the case).

**WCAG AA check:** After applying, verify text contrast ratios:

- `--color-text-primary` on `--color-base-100` ≥ 4.5:1
- `--color-heading` on `--color-base-100` ≥ 3:1 (large text)

**Visual check:** Light mode Hero, About, Contact pages should now read as warm-white/cream, consistent with "Midnight Sun in the desert" mood, not dated tan.

---

### 2-B Terminal window shell classes in `components.css`

> These classes use CSS variables directly — no Tailwind config required. Tailwind v4 will generate utilities from any `@theme` token referenced here via `@apply` or raw `var()` usage.

**Why:** The terminal window structure (rounded bordered container + header row + content area + status indicator row) is recreated manually in `ResumeDownload`, `ContactForm`, `MiniTerminal`, `WorkHero`, `BlogSection`.

**Add to `components.css`** (alongside existing `.hero` and `.prime-btn` sections):

```
.terminal-window          rounded border container with overflow-hidden
.terminal-window__header  px-4 py-3 flex items-center gap-2 border-b font-mono text-xs
.terminal-window__body    p-4 font-mono text-sm
.terminal-status          flex items-center gap-2 (status row wrapper)
.terminal-status__dot     w-3 h-3 rounded-full (colored dot)
.terminal-output-line     single output line with type-based color variants
  modifier: --info / --system / --success / --error / --command / --easter
```

Migrate the 5 affected components to use these classes. `TerminalHeader` (from 1-A) maps its dots to `.terminal-status__dot`.

---

### 2-C Inline style migration pass (incremental)

**After confirming token presence in `theme.css` `@theme` block (2-A)**, do one component at a time:

Priority order (highest inline style density first):

1. `BlogSection.jsx`
2. `ResumeDownload.jsx`
3. `ContactForm.jsx`
4. `MiniTerminal.jsx`
5. `CareerTimeline.jsx`
6. `TerminalSkills.jsx`
7. `WorkHero.jsx`
8. Remaining components

Rule: replace `style={{ color: 'var(--color-X)' }}` → `className="text-X"` etc. only where a direct Tailwind mapping exists. Leave Framer Motion `style` props (MotionValues) untouched.

---

### 2-D `background-effects.css` — wire or prune

**Current state:** `.grain-overlay` and `@keyframes grain` are defined but no element uses the class. The file is imported in `Layout.jsx` but produces dead CSS.

**Decision:** Add a `<div className="grain-overlay" aria-hidden="true" />` as the first child of the Layout background layer, protected by:

```
@media (prefers-reduced-motion: reduce) { .grain-overlay { display: none; } }
```

If rejected by visual review → remove the import and the file.

---

### 2-E `utilities.css` — duration tokens + focus normalization

**Current state:** `duration-300`, `duration-200`, `duration-500` are scattered as magic numbers. `.focus-ring` exists but is not applied consistently.

**Add to `utilities.css`:**

```css
/* Duration tokens — declare in @theme so Tailwind v4 generates duration-fast etc. */
/* Add these to theme.css @theme block, not here as :root — keeps token ownership clean */
/*   --duration-fast:   150ms;  */
/*   --duration-normal: 300ms;  */
/*   --duration-slow:   500ms;  */

/* Standardized focus ring — references CSS variables, no Tailwind config needed */
.focus-ring {
  @apply focus-visible:outline-2 focus-visible:outline-offset-2;
  outline-color: var(--color-lagoon);
}
.focus-ring-invert {
  @apply focus-visible:outline-2 focus-visible:outline-offset-2;
  outline-color: var(--color-coral);
}
```

> Duration tokens (`--duration-fast` etc.) belong in `theme.css` inside `@theme` so Tailwind v4 can generate `duration-fast`, `duration-normal`, etc. as utilities. Add them there, not in `:root` inside `utilities.css`.

Apply `.focus-ring` to all `<button>`, `<a>`, `<input>`, and `<textarea>` interactive elements across components that currently have ad-hoc or missing focus styles.

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

## Phase 3 — Frontend API Client + Error Boundary

**Goal:** Give the frontend a stable data layer so components don't own fetch logic directly, and add a safety net for runtime errors.

### 3-A `services/api.js` — centralized API client

**New file:** `client/src/services/api.js`

```
API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

Exports:
  api.projects.getAll()          GET /api/projects → project[]
  api.contact.submit(data)       POST /api/contact → { success, message }
  api.blog.getPosts(username, n) GET dev.to/api/articles?username=…&per_page=n
```

All methods throw typed errors on non-2xx. No component owns a raw `fetch` after this.

---

### 3-B Migrate `BlogSection.jsx` to `useAsyncOperation` + `api.blog`

`BlogSection` currently owns a hardcoded `fetch('https://dev.to/api/articles?username=tvatdci&per_page=5')`.
After this step it calls `api.blog.getPosts('tvatdci', 5)` via `useAsyncOperation`. Loading/error UI stays identical.

---

### 3-C `ErrorBoundary` component

**New file:** `client/src/components/ErrorBoundary.jsx`

Class component (required for `componentDidCatch`). Terminal-themed fallback UI matching the existing aesthetic (monospace font, coral error color, `$ restart` hint).

Wrap `<AppRoutes />` in `App.jsx`:

```jsx
<ErrorBoundary>
  <AppRoutes />
</ErrorBoundary>
```

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

## Phase 4 — Organization: Shared Primitives Folder

**Goal:** Establish the `shared/` structure for the extracted primitives so future features know where to add new components/hooks without dumping everything in `components/`.

### 4-A Create `components/primitives/` folder

Move the 2 new pure UI atoms from Phase 1:

```
components/primitives/
  TerminalHeader.jsx
  BlinkingCursor.jsx
```

Update all import paths. These are presentational-only, zero state, no side effects.

---

### 4-B Confirm `hooks/` barrel is complete

After all phases, `hooks/index.js` should export:

```
useDarkMode           (existing)
useInView             (existing)
useMousePosition      (existing)
useScrollVelocity     (existing)
useTerminalOutput     (Phase 1-C)
useProgressSimulation (Phase 1-D)
use3DTilt             (Phase 1-E)
useAsyncOperation     (Phase 1-F)
```

No other files should import a hook directly from its file path — always from `hooks/index.js`.

---

### 4-C `services/` barrel

After Phase 3:

```
services/
  api.js       (Phase 3-A)
  index.js     → export * from './api'
```

---

### Phase 4 verification

```bash
npm run lint && npm run build
```

- No broken import paths.
- `components/primitives/` imports resolve everywhere.
- Project still passes the full manual smoke checklist from Baseline.

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
