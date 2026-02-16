## Styles Folder Reconstruction Plan

Based on the current structure and Tailwind CSS v4 best practices, here's how I'd reorganize:

### Current Issues

1. `theme.css` still has a second `@theme` block (lines 4-16) which could cause issues
2. Files are mixing concerns - colors, fonts, base styles all in one place
3. No clear separation between design tokens and component styles

### Proposed Structure

```
client/src/styles/
├── index.css                 # Main entry point - imports only
├── tokens/
│   ├── colors.css            # ALL color definitions (merged from raw-theme.css)
│   ├── fonts.css             # Font imports & font-family definitions
│   └── spacing.css           # Custom spacing/sizing if needed
├── theme/
│   ├── light.css             # Light theme semantic mappings
│   └── dark.css              # Dark theme overrides (moved from theme.css)
├── base/
│   ├── reset.css             # CSS reset / normalize
│   └── global.css            # Body, html, root styles
├── components/
│   ├── hero.css              # Hero section styles
│   ├── buttons.css           # Button variants
│   └── terminal.css          # Terminal glow utilities
└── utilities/
    └── custom.css            # Custom @layer utilities
```

### Migration Steps

**1. Create `styles/tokens/colors.css`**

- Move ALL color definitions from `raw-theme.css` here
- Single `@theme` block with `--color-*: initial;`
- Include ALL color scales (primary, teal, ok, warn, fail, fuchsia, red, neutral)
- Include brand colors (lagoon, coral, driftwood, tide, dusk, avocado)
- Include semantic mappings (heading, text-primary, etc.)

**2. Create `styles/tokens/fonts.css`**

- Move font imports from `index.css`
- Move `@theme` font definitions here

**3. Create `styles/theme/light.css` and `styles/theme/dark.css`**

- Light theme: CSS custom properties for semantic colors
- Dark theme: `[data-theme='dark']` overrides (from current theme.css)

**4. Create `styles/base/global.css`**

- Move `body` and `:root` styles from `index.css`

**5. Create `styles/components/` files**

- Extract component-specific styles from current files

**6. Update `index.css`**

```css
@import "tailwindcss";
@import "./tokens/colors.css";
@import "./tokens/fonts.css";
@import "./base/global.css";
@import "./theme/light.css";
@import "./theme/dark.css";
@import "./components/hero.css";
@import "./components/terminal.css";
```

### Benefits

- **Single source of truth** for colors in `tokens/colors.css`
- **Clear separation** between tokens, themes, and components
- **Easier maintenance** - find colors in one place
- **Scalable** - easy to add new component styles
- **No duplicate `@theme` blocks** - prevents the reset bug
