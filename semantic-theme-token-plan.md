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

## 2. Core Objectives
1.  **Intent-Based Naming:** Replace variable names like `--color-lagoon` with names that describe their use, like `--color-brand-primary`.
2.  **Relative Color Math:** Adopt the `stylex` method of using relative OKLCH syntax for hover/active states to ensure mathematical consistency.
3.  **Clean Separation:** Ensure `colors.css` contains *zero* semantic mappings (no "brand" or "heading" names).
4.  **Scalable Theme Engine:** Make adding new themes (e.g., a high-contrast theme) as simple as re-mapping the Semantic Roles.

---

## 3. The New Semantic Role Map (Software Layer)

### A. Surfaces & Backgrounds
*   `--color-surface-base`: The main background.
*   `--color-surface-elevated`: Cards, panels, and modals.
*   `--color-surface-overlay`: Tooltips, menus, and translucent layers.

### B. Typography & Text
*   `--color-text-base`: Primary body text.
*   `--color-text-muted`: Secondary/dimmed text.
*   `--color-text-heading`: Hero and section titles.
*   `--color-text-inverted`: Text on dark backgrounds (for light mode) and vice versa.

### C. Actions & Brand
*   `--color-brand-primary`: Main brand accent (Terminal Lagoon).
*   `--color-brand-secondary`: Secondary accent (Midnight Sun Orange).
*   `--color-brand-accent`: High-energy accent for highlights.

### D. Status & Feedback
*   `--color-status-error`: Failure/Critical states.
*   `--color-status-success`: Success/Valid states.
*   `--color-status-warning`: Warning/Alert states.

### E. Interactive & Borders
*   `--color-border-default`: Standard component borders.
*   `--color-border-subtle`: Very light separators.
*   `--color-action-hover`: Dynamically calculated via relative OKLCH.

---

## 4. Implementation Steps

### Step 1: Audit & Mapping
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

---

**Next Step:** Generate the Comprehensive Mapping Table.
