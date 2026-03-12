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
*   Generate a "Translation Table" mapping every current variable in `theme.css` to its new Semantic Role.
*   Identify "Ghost Variables" that are no longer needed.

### Step 2: Rewrite `theme.css` Infrastructure
*   Define the new `@theme` block.
*   Implement the **Light Theme** mappings.
*   Implement the **Dark Theme** (`[data-theme='dark']`) overrides.
*   Add **Relative Color Logic** for hovers.

### Step 3: Component Migration
*   Update JSX components to use the new semantic Tailwind classes (e.g., `text-brand-primary` instead of `text-lagoon`).
*   Update `components.css` and `utilities.css` to reference the new roles.

### Step 4: Validation
*   Verify contrast ratios in both themes.
*   Ensure the Terminal aesthetic (glows/scanlines) remains intact.

## 5. Phase 5: Advanced UI Patterns (The stylex "Polish")

Following the success of the Tier 2 refactor, we will now adopt the high-level UI logic from the `stylex` prototype to make the portfolio more interactive and visually rich.

### A. Normalized Interaction Math
Instead of mapping hover colors to static legacy tokens, we will use **Relative OKLCH Syntax** for all interactive elements.
*   `--color-border-hover`: Derived from `--color-border-default` (+10% lightness).
*   `--color-text-hover`: Derived from `--color-brand-primary` (+5% chroma).

### B. Specialized "Software" Utilities
We will move complex CSS logic into Tailwind `@utility` directives to remove noise from JSX:
*   **`glass`**: Adaptive glassmorphism that uses `--color-surface-base` with dynamic opacity.
*   **`terminal-input`**: A functional utility combining border-glow, focus-rings, and background-mix logic.
*   **`btn-prime`**: The signature gradient-border button logic from `stylex`.

### C. Gradient Library Integration
Import the 14+ gradient stop definitions from `stylex/theme/colors.css` into our semantic layer, allowing us to use `bg-gradient-accent-1` through `8` consistently across both themes.
