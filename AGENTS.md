# MyPortfolio - AI Agent Guide

## Project Overview

A high-end interactive portfolio website with cinematic animations, terminal-inspired aesthetics, and sophisticated UI/UX. Built as a full-stack MERN application with a strong emphasis on visual storytelling and technical sophistication.

## Architecture

**Monorepo Structure:**
- **Frontend:** React 19 SPA with Vite build system (Port 5173) → `/client`
- **Backend:** Express.js REST API with MongoDB (Port 3001) → `/server`
- **Documentation:** Comprehensive planning docs in `/documents`
- **Assets:** Design references in `/references`

## Tech Stack

### Core Technologies
- **Framework:** React 19.2.0 with modern hooks and patterns
- **Build Tool:** Vite 7.2.4 (ESM only)
- **Styling:** Tailwind CSS v4.1.17 with `@theme` directive
- **Animation:** Framer Motion v12.23.24
- **Routing:** React Router v7.9.6
- **Smooth Scrolling:** Lenis v1.3.16
- **Backend:** Express.js 5.1.0 + Mongoose 9.0.0

### Additional Libraries
- `clsx` - Conditional class names
- `react-barcodes` - Decorative barcode elements (deprecated v1.2.0)
- `react-parallax-tilt` - 3D tilt effects
- `wicg-inert` - Accessibility polyfill

## Design Language & Aesthetic

**Theme:** Terminal-inspired, "Midnight Sun" aesthetic
- **Color System:** OKLCH colors with Tailwind v4 `@theme` directive
- **Typography:** Character-by-character SVG animations, monospace fonts (JetBrains Mono, Zodiak, Dune Rise)
- **Elements:** Barcodes, terminal outputs, 3D tilt effects, custom cursors
- **Backgrounds:** Advanced CSS-only effects (grain, blur, radial gradients), NOT WebGL

## Key Features Implemented

### Phase 1: Foundation ✅
- `TerminalLoader.jsx` - Terminal-style loading with ASCII art and "HALLO" welcome
- `SvgText.jsx` - Letter-by-letter SVG text animations with stagger effects
- `Barcode.jsx` - Decorative barcode elements using react-barcodes
- Theme system with OKLCH color palette via Tailwind v4 @theme directive

### Phase 2: Navigation ✅
- `Navbar.jsx` - Vertical left sidebar with backdrop blur, vertical text writing mode
- `CustomScrollbar.jsx` - Range input scrollbar with useTransform (not .get())
- `AudioToggle.jsx` - Global audio state with Web Audio API integration
- Active link indicator uses Framer Motion layoutId for smooth sliding animation

### Phase 3: Hero & Content ✅
- `Hero.jsx` - 3D mouse tilt effects using useSpring, "Midnight Sun" composition
- `ProjectCard.jsx` - 3D hover parallax with react-parallax-tilt
- `ProjectGrid.jsx` - Staggered animations with Intersection Observer
- `PageTransition.jsx` - 3D AnimatePresence transitions
- `Curtain.jsx` - Page transition overlay effect

### Phase 4: Advanced Interactions ✅
- `CustomCursor.jsx` - 3 trail elements, magnetic hover, click ripple
- `ProjectCard.jsx` - Video preview support (future enhancement)
- ❌ WebGL background - DEPRECATED (CSS-only approach chosen for performance)
- ❌ Hand gestures - SKIPPED (MediaPipe too heavy)

### Phase 5: Polish 📝 PARTIAL
- `HelpButton.jsx` - Help modal for user instructions
- Theme toggle with sun/moon icons
- Performance: Intersection Observer for scroll animations
- Accessibility: Reduced motion support, aria-labels

## Implementation Rules

### Critical Patterns
1. **No Inline Styles:** Use Tailwind classes or CSS variables in `theme.css`
2. **Accessibility:** Always include `aria-labels`, respect `prefers-reduced-motion`
3. **Performance:** 
   - Throttling for mouse-tracking hooks
   - Use `Intersection Observer` for scroll animations
   - Use `useTransform` not `.get()` for MotionValues
4. **Organization:** Controller-Service-Model for backend, strict component-based architecture for frontend

### Style Architecture (Hybrid Approach)

**File Structure:**
```
client/src/styles/
├── index.css        # Entry point + imports + base styles
├── colors.css       # RAW color scales (primitive tokens)
├── theme.css        # Semantic mappings + fonts + dark theme
├── components.css   # Component styles (hero, buttons)
└── utilities.css    # Utility classes (terminal glow, cursor)
```

**Design Tokens Pattern:**
- **colors.css:** Primitive tokens - raw color values that NEVER change
- **theme.css:** Semantic tokens - contextual meanings that CAN change per theme
- **Light theme:** CSS custom properties for semantic colors
- **Dark theme:** `[data-theme='dark']` overrides for inverted scales

### Animation Patterns

**Framer Motion Best Practices:**
- Use `variants` with `staggerChildren` for coordinated animations
- Use `useSpring` for physics-based motion (mouse tracking)
- Use `useTransform` for reactive MotionValue mapping
- Use `layoutId` for smooth layout animations (active link indicator)
- Avoid `.get()` during render - causes React warnings

**3D Effects:**
- `perspective: 1000` on containers
- `transformStyle: preserve-3d` for depth
- `useSpring` + `useTransform` for smooth mouse tilt
- Stagger delays: 0.08s, 0.15s, 0.25s for trail effects

## Important Technical Details

### Lenis Smooth Scroll
- Lenis exposed to `window.lenis` in `main.jsx` for global access
- Used by `useScrollVelocity` hook for scroll-based effects
- RAF loop in main.jsx drives the animation frame

### Custom Scrollbar Implementation
```jsx
// WRONG - causes React warnings
value={scrollYProgress.get() * 100}

// CORRECT - reactive with useTransform
const thumbY = useTransform(scrollYProgress, [0, 1], ['0%', 'calc(100vh - 48px)'])
```

### Background Effects
- CSS-only approach (grain, blur, radial gradients) over WebGL
- Global background layer in Layout.jsx (warm amber radial gradient)
- Body background set to `transparent` in index.css for proper layering
- WebGL components preserved in `/WebGL` folder but not imported

### Barcode Component
- Uses deprecated `react-barcodes` v1.2.0 (still functional)
- Alternative: `next-barcode` for future migration
- Decorative element only (no functional purpose)

## Scripts

### Client
```bash
cd client
npm run dev        # Vite dev server (localhost:5173)
npm run build      # Production build
npm run lint       # ESLint check
npm run lint:fix   # ESLint fix
npm run format     # Prettier format
npm run tailwind:build  # Manual Tailwind build
```

### Server
```bash
cd server
npm start          # Production server
npm run dev        # Development with nodemon
```

## Development Workflow

### Before Making Changes
1. Read relevant documentation in `/documents`
2. Check current branch and status
3. Understand the component structure and existing patterns

### When Implementing Features
1. Follow existing component patterns in `/client/src/components`
2. Use semantic Tailwind classes, no inline styles
3. Add accessibility attributes (aria-labels, focus states)
4. Respect `prefers-reduced-motion` for animations
5. Test on multiple screen sizes

### Testing Checklist
- [ ] Verify smooth scroll with Lenis
- [ ] Check CustomScrollbar thumb syncs with scroll position
- [ ] Test both light and dark themes
- [ ] Verify no React console warnings
- [ ] Check reduced motion preferences
- [ ] Test on mobile (touch devices hide custom cursor)

## Known Issues & Decisions

### WebGL Deprecation
- **Decision:** CSS-only background instead of WebGL
- **Reason:** WebGL context lost errors, performance impact, bundle size (1,380kB vs 492kB)
- **Result:** Better stability and performance

### react-barcodes Deprecation
- **Status:** Package deprecated, moved to `next-barcode`
- **Current:** Still using v1.2.0 (functional)
- **Future:** Consider migration to `next-barcode`

### Language Support
- **Decision:** English only
- **Removed:** LanguageContext.jsx and LangToggle.jsx
- **Reason:** User preference for simplicity

## Project Context Files

**Key Documentation:**
- `UI-FE-V1.md` - Complete UI/UX refactoring blueprint with all implementation details
- `project-instructions.md` - Technical persona and implementation rules
- `styles-refactor-hybrid.md` - CSS architecture and design tokens pattern
- `build.md` - Original MERN stack blueprint
- `bugfix-implementation-plan.md` - Recent fixes (Lenis, CustomScrollbar)

## Next Steps (From UI-FE-V1.md)

### Ready for Implementation
1. **Color System Refinement** - Light theme improvements, warm white/cream base
2. **Hero "Midnight Sun" Glow** - Add back animated orange/gold radial gradient
3. **Glass/Condensation Effects** - Subtle SVG filter for wet glass look (optional)
4. **Typography Contrast** - Ensure WCAG AA compliance in light mode
5. **Animation Polish** - Subtle parallax on global background (20-30px max)

### Future Enhancements
- Video previews in project cards
- Performance optimization (lazy loading, will-change)
- Additional accessibility testing
- Production deployment optimization

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-10  
**Branch:** feature/refactor-fe-v1  
**Status:** Phase 1-4 Complete, Phase 5 Partial
