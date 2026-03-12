# Plan: Semantic Theme Token Refactor (Tier 2)

This document outlines the strategy for refactoring the portfolio's styling architecture, adapting the "Semantic Role" methodology from the `stylex` prototype.

## 1. Architectural Philosophy
We are moving from a **Direct Mapping** system to a **Three-Tier Token** system. This separates the visual values (Hardware) from the functional intent (Software).

| Tier | Name | Description | Location |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Primitives** | Raw OKLCH scales (e.g., `neutral-800`, `teal-500`). Static and immutable. | `colors.css` |
| **Tier 2** | **Semantic Roles** | Functional names (e.g., `surface-base`, `brand-primary`). These change value per theme. | `theme.css` |
| **Tier 3** | **Component Tokens** | Specific UI needs (e.g., `terminal-cursor`, `input-bg`). They point to Tier 2. | `theme.css` |

---

## 2. Translation Blueprint: Semantic Role Mapping (Tier 2)

| Current Variable (Legacy) | New Semantic Role (Software) | Light Theme Primitive | Dark Theme Primitive |
| :--- | :--- | :--- | :--- |
| **Surfaces** | | | |
| `--color-bg-body` | `--color-surface-base` | `--color-base-100` | `--color-neutral-900` |
| `--color-card-bg` | `--color-surface-elevated` | `--color-base-200` | `--color-neutral-800` |
| `--color-outer-glow` | `--color-surface-overlay` | `rgba(10, 40, 80, 0.3)` | `rgba(70, 25, 10, 0.1)` |
| **Typography** | | | |
| `--color-text-primary` | `--color-text-base` | `--light-text-primary` | `--dark-text-primary` |
| `--color-text-secondary`| `--color-text-muted` | `--light-text-secondary`| `--dark-text-secondary`|
| `--color-heading` | `--color-text-heading` | `--color-lagoon` | `--color-dusk` |
| `--color-text-accent-alt`| `--color-text-inverted` | `--light-text-accent-alt`| `--dark-text-accent-alt`|
| **Brand & Actions** | | | |
| `--color-lagoon` | `--color-brand-primary` | `oklch(0.72 0.11 221.19)`| `oklch(0.72 0.11 221.19)`|
| `--color-coral` | `--color-brand-secondary`| `oklch(0.73 0.16 40.7)` | `oklch(0.73 0.16 40.7)` |
| `--color-dusk` | `--color-brand-accent` | `oklch(0.82 0.15 72.09)` | `oklch(0.82 0.15 72.09)` |
| **Feedback** | | | |
| `--color-ok-400` | `--color-status-success` | `oklch(0.75 0.25 150)` | `oklch(0.3 0.25 150)` |
| `--color-warn-400` | `--color-status-warning` | `oklch(0.75 0.25 90)` | `oklch(0.3 0.25 90)` |
| `--color-fail-400` | `--color-status-error` | `oklch(0.75 0.25 30)` | `oklch(0.3 0.25 30)` |
| **Borders** | | | |
| `--color-border-color` | `--color-border-default` | `--light-border-color` | `--dark-border-color` |
| `--color-neutral-100` | `--color-border-subtle` | `--color-neutral-100` | `--color-neutral-700` |

---

## 3. Atmosphere & Effects (Tier 3 Component Tokens)

| Component Token | Purpose | Mapping Logic |
| :--- | :--- | :--- |
| `--color-terminal-glow` | Text glow effect | `var(--color-brand-primary)` |
| `--color-terminal-cursor`| Blinking cursor | `var(--color-brand-primary)` |
| `--color-scanline` | CRT scanline effect | `color-mix(in srgb, var(--color-surface-base), transparent 90%)` |

---

## 4. Implementation Steps

### Step 1: Audit & Mapping ✅
*   Generated a "Translation Table" mapping every current variable in `theme.css` to its new Semantic Role.
*   Identified "Ghost Variables" that are no longer needed.

### Step 2: Rewrite `theme.css` Infrastructure ✅
*   Defined the new `@theme` block.
*   Implemented the **Light Theme** mappings.
*   Implemented the **Dark Theme** (`[data-theme='dark']`) overrides with full inverted scales.
*   Added **Relative Color Logic** for hovers and interactions.

### Step 3: Component Migration ✅
*   Updated JSX components to use the new semantic Tailwind classes (e.g., `text-brand-primary` instead of `text-lagoon`).
*   Updated `components.css` and `utilities.css` to reference the new roles.

### Step 4: Validation ✅
*   Verified contrast ratios in both themes via manual check.
*   Fixed build errors related to missing legacy tokens and unknown utility classes.
*   Ensured the Terminal aesthetic (glows/scanlines) remains intact.

## 5. Phase 5: Advanced UI Patterns (The stylex "Polish") ✅ COMPLETE

### A. Normalized Interaction Math ✅
Implemented relative OKLCH math for `--color-action-hover`, `--color-border-hover`, etc.

### B. Specialized "Software" Utilities ✅
Added `@utility glass`, `glass-elevated`, and `terminal-input`. Refactored `ContactForm.jsx` and `ProjectCard.jsx`.

### C. Gradient Library Integration ✅
Imported semantic gradient stops and preset gradients (`bg-grad-accent-1`, etc.).

---

## 6. Post-Mortem & Lessons Learned

### Hardware Scales are Critical
Initially, the hardware scales (50-950) were stripped during consolidation. This broke the **Diagnostic Grid** in `ThemeCard.jsx`. **Lesson:** Always preserve Tier 1 Primitives even when building Tier 2 Software roles.

### Legacy Bridges Prevent Build Failures
Removing variables like `--color-atmo-light-t` caused Vite/Tailwind build errors because they were still referenced in `@apply` rules within `components.css`. **Lesson:** Maintain a "Legacy Bridge" section in `theme.css` until all CSS files are fully refactored.

### Relative Color Math Complexity
Using `oklch(from var(...) ...)` is powerful but requires strict variable definitions. Ensure all base variables are initialized before being used in relative calculations.
