# MyPortfolio - Interactive MERN Stack Portfolio

A high-end interactive portfolio website with cinematic animations, terminal-inspired aesthetics, and sophisticated UI/UX. Built as a full-stack MERN application with a strong emphasis on visual storytelling and technical sophistication.

## Quick Start

```bash
# Frontend (Port 5173)
cd client && npm run dev

# Backend (Port 5000)
cd server && npm run dev
```

## Core Technologies

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12 |
| Routing | React Router v7 |
| Smooth Scroll | Lenis v1.3 |
| Backend | Express.js v5 + Mongoose |
| Database | MongoDB |

## Key Features

| Category | Features |
|----------|----------|
| **Visual** | Terminal loader with ASCII art, SVG text animations, custom cursor with trails, 3D tilt effects, warm amber "Midnight Sun" background |
| **Navigation** | Vertical sidebar with vertical text, custom scrollbar with range input, 3D page transitions |
| **Interactive** | Mini terminal easter eggs (whoami, chef, journalist, skills), hidden commands (matrix, sudo, coffee), Konami code detection |
| **Content** | Career timeline with scroll-triggered SVG path, filterable project grid with stat counters, terminal-styled contact form |

## Project Structure

```
/
├── client/              # React SPA (Port 5173)
│   ├── src/
│   │   ├── components/  # UI components (Hero, Navbar, Terminal, etc.)
│   │   ├── pages/       # Route pages (Home, About, Work, Contact)
│   │   ├── hooks/       # Custom hooks (use3DTilt, useTerminalOutput, etc.)
│   │   ├── styles/      # Tailwind v4 + Design Tokens
│   │   ├── services/    # API services (api.js)
│   │   └── utils/       # Utilities (motionPresets.js)
│   └── public/
├── server/              # Express API (Port 5000)
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
├── docs/                # Organized documentation (this is what gets pushed)
│   ├── timeline.md
│   ├── 01-project-overview.md
│   ├── 02-initial-setup.md
│   ├── 03-ui-refactoring.md
│   ├── 04-styling-evolution.md
│   ├── 05-feature-enhancements.md
│   ├── 06-bugfixes-technical.md
│   ├── 07-code-quality.md
│   ├── 08-future-improvements.md
│   └── 09-refactoring-v2.md
├── documents/           # Original planning docs (.gitignore - not pushed)
├── references/          # Design references
└── README.md            # This file
```

## Documentation

Detailed documentation is organized in `/docs`:

| File | Description |
|------|-------------|
| `docs/timeline.md` | Chronological evolution by phases |
| `docs/01-project-overview.md` | Project description and core technologies |
| `docs/02-initial-setup.md` | Original MERN stack initialization |
| `docs/03-ui-refactoring.md` | UI/UX enhancement phases 1-5 (Terminal aesthetic, SVG text, 3D effects) |
| `docs/04-styling-evolution.md` | Color system evolution, OKLCH tokens, light/dark themes |
| `docs/05-feature-enhancements.md` | Phases A-G (About, Work, Mini Terminal, Konami code, Blog, Resume, 404) |
| `docs/06-bugfixes-technical.md` | Bug fixes (Lenis exposure, CustomScrollbar .get() warning, WebGL deprecation) |
| `docs/07-code-quality.md` | Code standards, DRY patterns, component primitives |
| `docs/08-future-improvements.md` | Next steps (server-side integration, color refinements) |
| `docs/09-refactoring-v2.md` | V2 refactoring (TerminalHeader, BlinkingCursor, 4 custom hooks, API layer, primitives) |

## Current Development Status

**Frontend:** Feature-complete with polished animations and UI

**Backend:** In progress - contact form integration and database persistence pending completion

### Key Files for Next Agent

**Server-Side Priority:**
- `server/server.js` - Port 5000, MongoDB connection commented out (line 23-30)
- `server/controllers/` - Placeholder controllers need implementation
- `server/models/` - Need Contact model creation

**Frontend-to-Backend Bridge:**
- `client/src/services/api.js` - Defaults to localhost:3001 (needs 5000)
- `client/src/pages/Contact.jsx` - Uses setTimeout simulation (not real API)

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
- **Effects:** CSS-only background (grain, blur, radial gradients) - WebGL deprecated for performance

## Organization Logic

The documentation was restructured from scattered planning files into a coherent narrative:

1. **Chronological:** `timeline.md` shows evolution from initial setup → phases 1-5 → phases A-G → V2 refactoring
2. **Thematic:** Each numbered file focuses on a specific aspect (styling, UI, features, refactoring)
3. **Preserved:** Original documents in `/documents/` kept locally for reference but not pushed to remote
4. **Current State:** Future improvements prioritized by server-side work needed

---

See `docs/timeline.md` for the complete development journey.
