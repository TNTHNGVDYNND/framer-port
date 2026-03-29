# Styling Evolution

## Design Tokens Architecture

The project evolved through several styling approaches before settling on the current hybrid system.

### Three-Tier Token System

| Tier | Name | Description |
|------|------|-------------|
| **Tier 1** | Primitives | Raw OKLCH scales (e.g., `neutral-800`, `teal-500`). Static and immutable. |
| **Tier 2** | Semantic Roles | Functional names (e.g., `surface-base`, `brand-primary`). Change per theme. |
| **Tier 3** | Component Tokens | Specific needs (e.g., `terminal-cursor`, `input-bg`). Point to Tier 2. |

## Color System

### Brand Colors (OKLCH)

```css
--color-lagoon: oklch(0.72 0.11 221.19);    /* Primary blue */
--color-coral: oklch(0.73 0.16 40.7);       /* Secondary orange */
--color-dusk: oklch(0.82 0.15 72.09);       /* Accent purple */
--color-driftwood: oklch(0.79 0.06 74.59);  /* Light base */
--color-tide: oklch(0.49 0.08 205.88);      /* Dark accent */
```

### Semantic Mappings

| Semantic Role | Light Theme | Dark Theme |
|---------------|-------------|------------|
| `--color-bg-body` | `--color-driftwood` | `--color-neutral-900` |
| `--color-text-primary` | dark gray | light gray |
| `--color-heading` | `--color-lagoon` | `--color-dusk` |

## File Structure (Hybrid Approach)

```
client/src/styles/
├── index.css        # Entry point + imports + base styles
├── colors.css       # RAW color scales (primitive tokens)
├── theme.css        # Semantic mappings + fonts + dark theme
├── components.css  # Component styles
└── utilities.css   # Custom utilities (terminal glow, cursor)
```

### Purpose of Each File

- **colors.css**: Immutable primitive tokens - NEVER change
- **theme.css**: Semantic mappings that CAN change per theme
- **components.css**: Hero, buttons, card styles
- **utilities.css**: Terminal glow, cursor blink, scrollbar

## Theme Switching

### Light Theme
CSS custom properties with warm tones:
- Background: driftwood/beige tones
- Text: dark gray
- Accents: lagoon blue

### Dark Theme
Inverted via `[data-theme='dark']` selector:
- Background: deep neutral/amber tones
- Text: light gray
- Accents: dusk purple

## Important Lessons Learned

1. **Preserve Tier 1 Primitives**
   - Initially stripped during consolidation
   - Broke the diagnostic grid in ThemeCard.jsx
   - Always preserve color scales even when building semantic roles

2. **Legacy Bridges Prevent Build Failures**
   - Removing variables like `--color-atmo-light-t` caused Vite/Tailwind errors
   - They were still referenced in `@apply` rules
   - Maintain "Legacy Bridge" section until fully refactored

3. **Relative Color Math Complexity**
   - Using `oklch(from var(...) ...)` requires strict variable definitions
   - Ensure all base variables are initialized before relative calculations

## Styling Rules

- **No Inline Styles** - Use Tailwind classes or CSS variables
- **Use Semantic Classes** - `text-heading` instead of `text-lagoon`
- **OKLCH Format** - For perceptual uniformity
- **Tailwind @theme** - For defining design tokens

## References

- See `documents/styles-refactor-hybrid.md` for full implementation details
- See `documents/semantic-theme-token-plan.md` for the translation blueprint
