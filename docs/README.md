# MyPortfolio - Interactive MERN Stack Portfolio

A high-end interactive portfolio website with cinematic animations, terminal-inspired aesthetics, and sophisticated UI/UX. Built as a full-stack MERN application with a strong emphasis on visual storytelling and technical sophistication.

## Quick Overview

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Framer Motion
- **Backend:** Express.js + MongoDB (Mongoose)
- **Aesthetic:** Terminal-inspired "Midnight Sun" theme with OKLCH colors
- **Status:** Active development - server-side debugging in progress

## Project Structure

```
/
├── client/              # React SPA (Port 5173)
│   ├── src/
│   │   ├── components/ # UI components (Hero, Navbar, Terminal, etc.)
│   │   ├── pages/       # Route pages (Home, About, Work, Contact)
│   │   ├── hooks/       # Custom hooks (useScrollVelocity, etc.)
│   │   ├── styles/      # Tailwind v4 + Design Tokens
│   │   └── services/   # API services
├── server/              # Express API (Port 5000)
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers
│   └── routes/         # API routes
├── documents/           # Original planning docs (reference)
├── docs/                # This organized documentation
└── references/         # Design references
```

## Key Features Implemented

### Visual & Animation
- Terminal-style loading screen with ASCII art
- Character-by-character SVG text animations
- Custom cursor with trail effects and magnetic hover
- 3D tilt effects on cards using Framer Motion
- Custom scrollbar with range input interaction

### Navigation & UX
- Vertical left sidebar with vertical text writing mode
- Custom scrollbar synced with scroll position
- Page transitions with 3D AnimatePresence
- Audio toggle with Web Audio API

### Content Pages
- **Home:** Hero with "Midnight Sun" composition and mouse tilt
- **Work:** Filterable project grid with stat counters
- **About:** Career timeline with scroll-triggered SVG path animation, Terminal skills component
- **Contact:** Terminal-styled form with real-time output display

### Interactive Elements
- **Mini Terminal:** Easter eggs with hidden commands (matrix, sudo, coffee)
- **Konami Code:** Secret mode activation (⬆⬆⬇⬇⬅➡⬅➡BA)

## Original Documents (Reference)

The `documents/` folder contains the original planning and implementation documents. These are preserved for historical reference and contain detailed technical information:

| Document | Purpose |
|----------|---------|
| `build.md` | Original MERN blueprint |
| `context.md` | Original GEMINI.md planning context |
| `project-instructions.md` | Technical persona and implementation rules |
| `UI-FE-V1.md` | Comprehensive UI/UX refactoring blueprint |
| `styles-refactor-hybrid.md` | CSS architecture and design tokens |
| `bugfix-implementation-plan.md` | Recent bug fixes |

See cross-references in each section for which original document informed each topic.

## Documentation Sections

| File | Description |
|------|-------------|
| [timeline.md](timeline.md) | Chronological evolution by phases |
| [01-project-overview.md](01-project-overview.md) | What this project is |
| [02-initial-setup.md](02-initial-setup.md) | Original MERN stack setup |
| [03-ui-refactoring.md](03-ui-refactoring.md) | UI/UX enhancement phases |
| [04-styling-evolution.md](04-styling-evolution.md) | Color system & design tokens |
| [05-feature-enhancements.md](05-feature-enhancements.md) | Phases A-G features |
| [06-bugfixes-technical.md](06-bugfixes-technical.md) | Bug fixes & technical decisions |
| [07-code-quality.md](07-code-quality.md) | Code standards & cleanup |
| [08-future-improvements.md](08-future-improvements.md) | What's next |

## Key Files for Next Agent

### Server-Side Priority
```
server/server.js           # Port 5000, MongoDB connection commented out (line 23-30)
server/controllers/        # Placeholder controllers need implementation
server/models/            # Need Contact model creation
```

### Frontend-to-Backend Bridge
```
client/src/services/api.js  # Defaults to localhost:3001 (needs 5000)
client/src/pages/Contact.jsx  # Uses setTimeout simulation (not real API)
```

### Documentation Source
```
documents/UI-FE-V1.md       # Most comprehensive planning doc
documents/06-bugfixes-technical.md  # Server port alignment issue
```

## Running the Project

```bash
# Frontend
cd client && npm run dev

# Backend
cd server && npm run dev
```

## Current Development Status

**Active Work:** Server-side debugging and finalization pending.

The frontend is feature-complete with polished animations and UI. Backend endpoints exist but contact form integration and database persistence need completion.

## Tech Stack

- React 19.2.0
- Vite 7.2.4
- Tailwind CSS v4.1.17
- Framer Motion v12.23.24
- React Router v7.9.6
- Lenis v1.3.16 (smooth scroll)
- Express.js 5.1.0
- MongoDB + Mongoose 9.0.0

## Design System

- **Colors:** OKLCH-based with "Midnight Sun" palette (lagoon, coral, dusk, driftwood)
- **Typography:** JetBrains Mono, Zodiak, Dune Rise
- **Effects:** CSS-only background (grain, blur, radial gradients)

---

See [timeline.md](timeline.md) for the complete development journey.
