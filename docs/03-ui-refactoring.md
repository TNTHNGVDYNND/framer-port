# UI/UX Refactoring

## Overview

Major visual overhaul inspired by [Shoya Kajita](https://shoya-kajita.com/) to create a terminal-inspired, cinematic portfolio experience.

## Phase 1: Foundation & Visual Identity

### Typography System Overhaul
- Converted hero title to SVG letter animations
- Created `SvgText.jsx` component with character-by-character reveals
- Implemented monospace font stack (JetBrains Mono)

### Loading Screen Enhancement
- Built custom TerminalLoader (not using external package)
- Terminal-style loader with "HALLO" welcome
- ASCII art elements
- Progress bar with block characters

### Design System Updates
- Added Barcode component using react-barcodes
- Updated Tailwind theme with terminal colors
- Barcode positioned as decorative element throughout site

## Phase 2: Navigation & Controls

### Navigation Redesign
- Transformed horizontal navbar to vertical left sidebar
- Fixed position with backdrop blur
- Active link indicator uses Framer Motion `layoutId` for smooth sliding
- Vertical text writing mode (`writing-mode: vertical-rl`)

### Custom Scrollbar Implementation
- Built `CustomScrollbar.jsx` with range input
- Progress bar synced with scroll position
- Interactive - can drag to navigate
- Terminal aesthetic styling

### Audio System
- Created AudioToggle component
- Global audio state with Web Audio API
- Sound toggle in navbar

## Phase 3: Hero & Content Enhancement

### Hero Section
- 3D mouse tilt effects using useSpring
- "Midnight Sun" composition - content at bottom (20%), luminous gradient at top (80%)
- SVG text animations
- Barcode decorations

### Project Gallery
- 3D hover parallax on ProjectCard
- Tilt effect using react-parallax-tilt
- Video preview support (future enhancement)
- Staggered animations in ProjectGrid

### Page Transitions
- 3D AnimatePresence transitions
- Route-specific entry/exit animations
- Curtain overlay effect

## Phase 4: Advanced Interactions

### Hand Gesture Controls - SKIPPED
- Decision: Not implementing MediaPipe (too heavy, complex)
- Alternative: Focus on mouse/scroll interactions with Framer Motion

### Enhanced Cursor
- Custom cursor with 3 trail elements
- Magnetic hover on interactive elements
- Ripple click effects
- Hidden on touch devices

### WebGL Background - DEPRECATED
- Attempted WebGL shader implementation
- Issues: Context lost errors, performance impact, bundle size (1,380kB)
- **Final Decision:** CSS-only approach
- Created `background-effects.css` with:
  - Animated film grain overlay
  - Glass morphism
  - Warm amber glow animation
  - Mist/fog layers
  - Vignette effect

### Result: CSS-Only Background
- Bundle size: 492 kB (65% smaller)
- Build time: 3.1s (3x faster)
- Stable 60fps performance
- No WebGL issues

## Implementation Patterns

### SVG Text Animation
```jsx
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 }
  })
};
```

### 3D Tilt Effect
```jsx
const rotateX = useSpring(useTransform(mouseY, [-1, 1], [10, -10]), {
  stiffness: 150,
  damping: 20
});
```

### Custom Scrollbar
```jsx
const thumbY = useTransform(scrollYProgress, [0, 1], ['0%', 'calc(100vh - 48px)']);
// NOT using .get() which causes React warnings
```
