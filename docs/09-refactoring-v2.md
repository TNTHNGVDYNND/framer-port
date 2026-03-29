# V2 Frontend Refactoring

## Overview

Major architectural refactoring of the frontend codebase to improve maintainability, reduce code duplication, and establish consistent patterns. This was a systematic DRY (Don't Repeat Yourself) initiative across 5 phases.

**Status:** ✅ All 5 phases complete (commits `f171b7a` → `81a8258` on `feature/refactor-fe-v2`)

---

## Phase 1: Extract UI Primitives & Hooks

Eliminated 7 copy-paste patterns by extracting reusable components and hooks.

### New Components Created

| Component | Purpose | Consumers |
|-----------|---------|-----------|
| `TerminalHeader.jsx` | Terminal window header with traffic lights | ContactForm, TerminalLoader, MiniTerminal, ResumeDownload, BlogSection, CareerTimeline, WorkHero |
| `BlinkingCursor.jsx` | Animated blinking cursor | ContactForm, TerminalLoader, MiniTerminal |

### New Hooks Created

| Hook | Purpose | Consumers |
|------|---------|-----------|
| `useTerminalOutput()` | Terminal line management with `{ output, addLine, addLines, clear }` | ContactForm, TerminalLoader, MiniTerminal |
| `useProgressSimulation()` | Animated progress with block characters | ContactForm, ResumeDownload |
| `use3DTilt()` | 3D mouse tilt effects with spring physics | Hero (window-relative), ProjectCard (element-relative) |
| `useAsyncOperation()` | Async state management with loading/error states | BlogSection |

### Utility Module

**`motionPresets.js`** - Centralized Framer Motion configurations:
- `SPRING_DEFAULT`, `SPRING_GENTLE`, `SPRING_SNAPPY`
- `STAGGER_DEFAULT`, `STAGGER_SLOW`
- `FADE_UP`, `FADE_IN`, `SCALE_IN`
- `SLIDE_FROM_LEFT`, `SLIDE_FROM_RIGHT`
- `TILT_DEFAULT`

---

## Phase 2: Style System Token Audit

### Light Theme Improvements

Changed light theme from dated tan to warm cream:
- `--light-bg-body`: `oklch(98% 0.01 90)` (warm cream)
- `--color-base-100/200/300`: Semantic base colors
- `--color-accent-glow`: Subtle amber glow

### CSS Architecture

Created semantic CSS classes in `components.css`:
```css
.terminal-window          /* Terminal container */
.terminal-window__header  /* Traffic light header */
.terminal-window__body    /* Content area */
.terminal-status          /* Status indicators */
.terminal-status__dot     /* Traffic light dots */
.terminal-output-line     /* Output styling with type modifiers */
```

### Inline Style Migration

Migrated 50+ inline styles to Tailwind classes:
- Static `var(--color-X)` → `text-X` / `bg-X` / `border-X`
- Dynamic values kept as `style=` (Framer Motion, conditional states)
- MotionValues (`pathLength`) preserved
- Complex gradients/shadows preserved

### New Utilities

**`utilities.css`** additions:
```css
/* Duration tokens */
--duration-fast: 150ms
--duration-normal: 300ms
--duration-slow: 500ms

/* Focus states */
.focus-ring-invert      /* Coral outline for dark backgrounds */
.focus-ring             /* Standard focus ring */
```

**`background-effects.css`**:
- `.grain-overlay` with reduced motion support

---

## Phase 3: API Client & Error Handling

### Services Layer

**`services/api.js`** - Centralized API client:
```javascript
api.projects.getAll()           // GET /api/projects
api.contact.submit(data)          // POST /api/contact
api.blog.getPosts(username, n)  // dev.to integration
```

**`services/index.js`** - Barrel export for clean imports

### Error Boundary

**`ErrorBoundary.jsx`** - Terminal-themed error fallback:
- Coral ASCII error banner
- Monospace typography
- Reload button with focus ring
- Wrapped around `<AppRoutes />`

---

## Phase 4: Organization - Shared Primitives

### Folder Structure

```
client/src/
├── components/
│   └── primitives/
│       ├── TerminalHeader.jsx
│       ├── BlinkingCursor.jsx
│       └── index.js          # Barrel export
├── hooks/
│   └── index.js              # All 8 hooks exported
├── services/
│   └── index.js              # API barrel export
└── utils/
    └── motionPresets.js      # Animation configs
```

### Migration Stats

- **7 consumers** updated to use `primitives/` imports
- **10 files** updated to use `hooks/` barrel
- **1 file** using `services/` barrel (BlogSection)

---

## Phase 5: Scalability - Standardized Variants

### Motion Preset Expansion

Added specialized variants to `motionPresets.js`:

```javascript
PROJECT_CARD_ENTRY  // 3D rotation, spring physics, stagger factory
SECTION_ENTRY       // Standard 30px fade-up for sections
FADE_DOWN          // Top-level header entries
```

### Consumer Refactoring

- `ProjectCard.jsx` - Removed hardcoded animations, uses `PROJECT_CARD_ENTRY`
- `WorkHero.jsx` - Standardized `whileInView` patterns
- All section entries now consistent

---

## File Changes Summary

### New Files (13)

```
client/src/components/primitives/TerminalHeader.jsx
client/src/components/primitives/BlinkingCursor.jsx
client/src/components/primitives/index.js
client/src/components/ErrorBoundary.jsx
client/src/hooks/useTerminalOutput.js
client/src/hooks/useProgressSimulation.js
client/src/hooks/use3DTilt.js
client/src/hooks/useAsyncOperation.js
client/src/hooks/index.js
client/src/services/api.js
client/src/services/index.js
client/src/utils/motionPresets.js
```

### Modified Files (18)

```
client/src/styles/theme.css          # Warm cream light theme
client/src/styles/components.css    # Terminal window classes
client/src/styles/utilities.css     # Duration tokens, focus rings
client/src/styles/background-effects.css  # Grain overlay
client/src/App.jsx                  # ErrorBoundary wrapper
client/src/hooks/index.js           # New hook exports
client/src/components/ContactForm.jsx
client/src/components/TerminalLoader.jsx
client/src/components/MiniTerminal.jsx
client/src/components/ResumeDownload.jsx
client/src/components/BlogSection.jsx
client/src/components/WorkHero.jsx
client/src/components/CareerTimeline.jsx
client/src/components/Hero.jsx
client/src/components/ProjectCard.jsx
client/src/components/TerminalSkills.jsx
```

### Unchanged (by design)

- `tailwind.config.js` - Content/darkMode only, no theme.extend
- `color/` directory - Phase 2 used existing structure

---

## Technical Achievements

✅ **Code Duplication Eliminated** - 7 repeated patterns extracted  
✅ **Consistent Patterns** - All terminal windows use same header component  
✅ **Type Safety** - Hooks return predictable shapes  
✅ **Bundle Size** - No new dependencies, only extraction (~399 kB JS maintained)  
✅ **Lint Baseline** - 58 errors / 8 warnings (pre-existing, none introduced)  
✅ **Build Stability** - All phases independently verifiable  

---

## Design Decisions

### Tailwind v4 Architecture
- Token mapping via `@theme` directive only
- `tailwind.config.js` never receives `theme.extend`
- All semantic colors in `theme.css`

### Hook Patterns
- `use3DTilt` exposes `isHovered` for conditional styling
- `useAsyncOperation` accepts `deps` array for auto-execution
- `useTerminalOutput` manages line arrays with unique IDs

### Migration Strategy
- Static values → Tailwind classes
- Dynamic values → Preserved as inline styles
- Framer Motion → Preserved (MotionValues, transforms)

---

## Verification Commands

```bash
cd client
npm run lint          # Baseline: 58 errors / 8 warnings
npm run build         # 502 modules, ~399 kB JS
```

**Smoke Check:**
- Theme toggle (light/dark) ✓
- Terminal headers render ✓
- Blinking cursors visible ✓
- Contact form progress animation ✓
- Project card tilt effects ✓
- Scrollbar thumb tracking ✓
- Navbar active indicator sliding ✓

---

*Source: `documents/plans/V2-plan-1.md`*  
*Branch: `feature/refactor-fe-v2`*  
*Commits: f171b7a → 81a8258*
