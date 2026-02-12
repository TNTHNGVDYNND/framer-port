Current State Analysis
Original MyPortfolio:

- ✅ Modern React 19 + Tailwind v4 + Framer Motion
- ✅ Component-based architecture
- ✅ Dark theme system with OKLCH colors
- ✅ Multi-stage animations (preloader, curtain)
- ❌ Standard web fonts (not SVG typography)
- ❌ Basic loading screen (not terminal-style)
- ❌ Traditional horizontal navbar
- ❌ Native browser scrollbar
- ❌ No gesture controls or 3D elements

  Shoya Kajita Site: (https://shoya-kajita.com/)

- SVG-based animated typography for every letter
- Terminal-style loading with system info display
- Vertical left sidebar navigation
- Custom scrollbar with range input
- Hand gesture camera control (advanced!)
- Barcode design elements throughout
- Sound/audio toggle
- Japanese/English multilingual support
- WebGL/3D rendering pipeline

---

Refactoring Plan - Phases

Phase 1: Foundation & Visual Identity (3-4 days)
Goal: Establish the technical/terminal aesthetic

1. Typography System Overhaul
   - Convert hero title to SVG letter animations
   - Create SvgText.jsx component for animated character-by-character reveals
   - Implement monospace/terminal font stack (Roboto Mono, JetBrains Mono)
2. Loading Screen Enhancement
   - Replace current preloader with terminal-style loader
   - Add "system info" display with loading steps
   - Show mock "environment variables" during load
   - Implement barcode graphic element in loader
3. Design System Updates
   - Add barcode SVG component for decorative elements
   - Create Barcode.jsx component
   - Update Tailwind theme with terminal colors
   - Add structured data/schema.org markup to pages

Phase 2: Navigation & Controls (3-4 days)
Goal: Implement custom navigation and interface elements

4. Navigation Redesign
   - Transform horizontal navbar to vertical left sidebar
   - Fix position with backdrop blur
   - Update active link indicator to vertical sliding bar
   - Add language toggle (JP/EN) component
5. Custom Scrollbar Implementation
   - Build CustomScrollbar.jsx component with range input
   - Replace native scrollbars site-wide
   - Style to match terminal aesthetic
6. Audio System
   - Add sound/audio toggle button
   - Create AudioToggle.jsx component
   - Hook up to future audio elements (video, hover sounds)

Phase 3: Hero & Content Enhancement (4-5 days)
Goal: Elevate the hero section with advanced animations

7. Hero Section Refactor
   - Enhance current staggered text with SVG letter paths
   - Add atmosphere/gradient background animation
   - Implement 3D tilt effects on hero elements
   - Add barcode decoration elements
8. Project Gallery Upgrade
   - Convert horizontal scroll to interactive 3D grid
   - Add tilt parallax effects on project cards
   - Implement video previews with custom controls
9. Page Transitions
   - Enhance AnimatePresence transitions with 3D effects
   - Add route-specific entry/exit animations

Phase 4: Advanced Interactions (5-7 days)
Goal: Implement cutting-edge interaction features

10. Hand Gesture Controls (Research & POC)
    - Integrate MediaPipe for hand tracking
    - Enable camera access UI flow
    - Implement basic pointer control
    - Research feasibility for full implementation
11. Enhanced Cursor & Hover Effects
    - Custom cursor with trail effects
    - Magnetic hover on interactive elements
    - Ripple click effects
    - 3D depth on cards
12. Video & 3D Elements - Add video backgrounds to sections - Implement WebGL shader effects - Create 3D project showcases using three.js

Phase 5: Polish & Deployment (3-4 days)
Goal: Final polish and performance optimization

13. Modals & Documentation
    - Add "How to Use" modals
    - Create instructions for gesture controls
    - Implement loading states for all interactions
14. Performance Optimization
    - Lazy load heavy 3D libraries
    - Optimize animations with proper will-change
    - Implement intersection observers
15. Accessibility & Testing
    - Ensure keyboard navigation works
    - Add fallback for unsupported browsers
    - Test on multiple devices

---

Key Components to Create
New Components:

- SvgText.jsx - Animated SVG typography
- TerminalLoader.jsx - Enhanced loading screen
- Barcode.jsx - Decorative barcode graphics
- CustomScrollbar.jsx - Scrollbar replacement
- AudioToggle.jsx - Sound control
- LangToggle.jsx - Language switcher
- Cursor.jsx - Custom cursor with effects
- HandGestureController.jsx - MediaPipe integration
  Enhanced Components:
- Navbar.jsx → Vertical sidebar redesign
- Hero.jsx → SVG typography + 3D effects
- ProjectCard.jsx → Tilt + video preview
- Layout.jsx → Global gesture/state management

---

Implementation Order Recommendation

- Start with Phase 1 to quickly establish the visual identity. The SVG typography and terminal loader will provide immediate visual impact with manageable complexity.
- Next, Phase 2 to improve navigation and user control elements. These are self-contained features.
- Phase 3 will be the most visible improvements to all content sections.
- Phase 4 contains the advanced features (gestures, 3D). In this phase it can treat these as stretch goals or implement incrementally based on time/effort.
- Phase 5 final polish.

---

Phase 1 Technical Implementation Details

1. Typography System Overhaul
   Approach:

- Use Framer Motion's variants with staggerChildren pattern
- Split text into individual characters via text.split("")
- Wrap each character in <motion.span> with animation variants
- For SVG paths: use pathLength animation with strokeDasharray/strokeDashoffset
  Implementation Pattern:
  // Split text into letters
  const letters = text.split("");
  const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
  opacity: 1,
  y: 0,
  transition: {
  delay: i \* 0.05, // Stagger delay per character
  duration: 0.5,
  }
  })
  };
  // Use in component
  {letters.map((char, i) => (
  <motion.span
  key={i}
  custom={i}
  variants={letterVariants}
  >
      {char}
  </motion.span>
  ))}
  Font Stack: Use monospace fonts - JetBrains Mono, Roboto Mono, or Fira Code for terminal aesthetic

---

2. Loading Screen Enhancement
   Approach: Use react-terminal or @envoy1084/react-terminal packages
   Recommended: @envoy1084/react-terminal - more customizable and lightweight
   Implementation Pattern:
   import { Terminal, TypingAnimation, TerminalOutput } from '@envoy1084/react-terminal';
   <Terminal>
   <TypingAnimation>WELCOME</TypingAnimation>
   <TerminalOutput>NAME: Shoya Kajita</TerminalOutput>
   <TerminalOutput>ROLE: Developer</TerminalOutput>
   <TerminalOutput>Loading environment...</TerminalOutput>
   <TerminalOutput>Progress: [====================]</TerminalOutput>
   </Terminal>
   System Info Display:

- Create array of loading phases: "Loading environment...", "Initializing WebGL...", etc.
- Use setInterval to cycle through phases
- Animate progress bar width based on actual loading state
- Add matrix rain background effect using CSS animations

---

3. Design System Updates (Barcode Component)
   Approach: Use react-barcodes npm package
   Installation: npm install react-barcodes
   Implementation Pattern:
   import { useBarcode } from 'react-barcodes';
   const { inputRef } = useBarcode({
   value: 'SHOYA-KAJITA',
   options: {
   format: 'CODE128',
   width: 2,
   height: 40,
   displayValue: false,
   background: 'transparent',
   lineColor: '#ffffff',
   }
   });
   // Render
   <svg ref={inputRef} />
   Barcode Types: CODE128 recommended for alphanumeric codes used in portfolios

---

Package Dependencies Required:
{
dependencies: {
framer-motion: ^12.23.24, // Already have
@envoy1084/react-terminal: ^1.0.0,
react-barcodes: ^1.2.0
}
}
