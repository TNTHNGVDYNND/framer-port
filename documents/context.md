# High-End Interactive Portfolio (framer-port)

## Project Overview

This project is a visually sophisticated, high-performance portfolio website built with a terminal-inspired "Midnight Sun" aesthetic. It emphasizes fluid animations, interactive terminal-style elements, and a cinematic user experience. Originally conceived as a port from Framer, it is now a fully custom React-based application.

- **Primary Technologies:** React 19, Vite, Tailwind CSS v4, Framer Motion v12, React Router v7, Lenis (Smooth Scroll).
- **Backend:** Node.js (Express v5) with Mongoose (MongoDB).
- **Aesthetic:** OKLCH color-based "Midnight Sun" theme, monochrome JetBrains Mono typography, heavy use of SVG filters (turbulence/displacement), and 3D tilt effects.

---

## Directory Structure

- `client/`: The React-based frontend application.
  - `src/components/`: Modular UI components (Hero, Navbar, ProjectGrid, Terminal elements).
  - `src/styles/`: Hybrid styling architecture using Tailwind v4 `@theme` and semantic Design Tokens.
  - `src/hooks/`: Custom hooks for scroll velocity, progress simulation, terminal output, etc.
  - `src/pages/`: Main page components (Home, About, Work, Contact).
- `server/`: The Express-based API server.
- `documents/`: Detailed implementation plans, bugfix logs, and design instructions (e.g., `project-instructions.md`, `styles-refactor-hybrid.md`).
- `plans/`: High-level development and debugging strategies.

---

## Building and Running

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Frontend (Client)

```bash
cd client
npm install
npm run dev
```

- **Dev URL:** `http://localhost:5173`
- **Linting:** `npm run lint`
- **Formatting:** `npm run format`

### Backend (Server)

```bash
cd server
npm install
npm run dev
```

- **Dev URL:** `http://localhost:5000` (uses Nodemon for auto-restart)
- **API Base Path:** `/api`

---

## Development Conventions & Guidelines

### Styling (Tailwind CSS v4 + Design Tokens)

- **Hybrid Approach:** Follow the pattern in `documents/styles-refactor-hybrid.md`.
  - `colors.css`: Immutable primitive color tokens.
  - `theme.css`: Semantic mappings and dark theme overrides.
  - `components.css`: Component-specific styles.
  - `utilities.css`: Custom utility classes (terminal glow, cursor blink).
- **No Inline Styles:** Use Tailwind classes or CSS variables defined in the theme.
- **Color Format:** Prefer **OKLCH** for semantic consistency and perceptual uniformity.

### Animation (Framer Motion v12)

- **Patterns:** Prioritize `variants`, `staggerChildren`, and `useSpring` for physics-based motion.
- **Transitions:** Use `AnimatePresence` for smooth page transitions and modal entries.
- **Accessibility:** Respect `prefers-reduced-motion` using the `prefersReducedMotion` constant where applicable.

### Component Standards

- **Interactivity:** Every component should feel "alive" (hover states, subtle shifts, or reactive elements).
- **Performance:** Throttled mouse-tracking; use `Intersection Observer` (via `useInView` hook) for scroll-triggered animations.
- **Typography:** Monospace font stacks (JetBrains Mono) for that terminal feel.

### Code Quality

- **React 19:** Use modern hooks; avoid deprecated patterns.
- **ESM:** The project uses ES Modules (`"type": "module"`) in both client and server.
- **Folder Structure:** Keep components small and focused. Consolidate logic into custom hooks.

---

## Key Files to Reference

- `documents/project-instructions.md`: Core design and technical mandates.
- `documents/styles-refactor-hybrid.md`: Detailed styling architecture.
- `client/src/styles/index.css`: Style entry point.
- `client/src/AppRoutes.jsx`: Routing configuration.
- `server/server.js`: API entry point.

---

_This GEMINI.md is a living document meant to provide context for AI-assisted development._
