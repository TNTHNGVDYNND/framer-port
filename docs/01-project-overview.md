# Project Overview

## What This Project Is

A visually sophisticated, high-performance portfolio website built with a terminal-inspired "Midnight Sun" aesthetic. It emphasizes fluid animations, interactive terminal-style elements, and a cinematic user experience.

Originally conceived as a port from Framer, it is now a fully custom React-based application.

## Core Technologies

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19 |
| Build Tool | Vite (ESM only) |
| Styling | Tailwind CSS v4 with @theme directive |
| Animation | Framer Motion v12 |
| Routing | React Router v7 |
| Smooth Scroll | Lenis v1.3.16 |
| Backend | Express.js v5 + Mongoose |
| Database | MongoDB |

## Aesthetic & Design Language

- **Theme:** Terminal-inspired "Midnight Sun" aesthetic
- **Color System:** OKLCH colors with semantic design tokens
- **Typography:** Monospace fonts (JetBrains Mono), character-by-character SVG animations
- **Elements:** Barcodes, terminal outputs, 3D tilt effects, custom cursors
- **Backgrounds:** Advanced CSS-only effects (grain, blur, radial gradients) - NOT WebGL

## Directory Structure

```
client/
├── src/
│   ├── components/     # Modular UI (Hero, Navbar, Terminal, etc.)
│   ├── pages/          # Route pages (Home, About, Work, Contact)
│   ├── hooks/         # Custom hooks
│   ├── styles/        # Hybrid Tailwind + Design Tokens
│   └── services/      # API services
└── public/

server/
├── models/            # Mongoose schemas
├── controllers/       # Route handlers
├── routes/            # API endpoints
└── server.js          # Entry point

documents/             # Original planning docs (reference)
references/           # Design assets
```

## Key Components

| Component | Purpose |
|-----------|---------|
| TerminalLoader | Terminal-style loading with ASCII art |
| SvgText | Character-by-character SVG animations |
| Barcode | Decorative barcode elements |
| Navbar | Vertical left sidebar |
| CustomScrollbar | Range input scrollbar |
| Hero | 3D mouse tilt effects |
| ProjectCard | 3D hover parallax |
| CustomCursor | Trail effects + magnetic hover |
| MiniTerminal | Easter egg command system |
| CareerTimeline | Scroll-triggered SVG path animation |
| TerminalSkills | Terminal-style progress bars |

## Development Status

**Frontend:** Feature-complete with polished animations and UI

**Backend:** In progress - contact form integration and database persistence pending completion

## Design Decisions

1. **CSS-only backgrounds** - WebGL deprecated due to context loss errors and performance impact
2. **English only** - Language toggle removed for simplicity
3. **OKLCH colors** - Perceptually uniform color space for consistent theming
4. **No inline styles** - All styles via Tailwind classes or CSS variables
