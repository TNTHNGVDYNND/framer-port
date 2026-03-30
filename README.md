# Zenfolio - Interactive MERN Stack Portfolio

A high-end interactive portfolio website with cinematic animations, terminal-inspired aesthetics, and sophisticated UI/UX. Built as a full-stack MERN application with a strong emphasis on visual storytelling and technical sophistication.

## Why This Project Exists

This project was built to explore:

- Advanced UI/UX patterns beyond standard portfolios
- AI-assisted development workflows using structured prompting
- Scalable frontend architecture with reusable primitives
- Real-time iteration and refactoring practices

It serves as both:

1. A portfolio
2. A documented learning system

## Quick Start

```bash
# Frontend (Port 5173)
cd client && npm run dev

# Backend (Port 5000)
cd server && npm run dev
```

## AI-Assisted Development

- Prompt engineering stored in structured `.md` files
- Iterative UI refinement using LLM feedback loops
- Documentation generated and refactored using AI agents
- Decision tracking through prompt history

See `/docs` for full evolution.

## Core Technologies

| Layer              | Technology               |
| ------------------ | ------------------------ |
| Frontend Framework | React 19                 |
| Build Tool         | Vite                     |
| Styling            | Tailwind CSS v4          |
| Animation          | Framer Motion v12        |
| Routing            | React Router v7          |
| Smooth Scroll      | Lenis v1.3               |
| Backend            | Express.js v5 + Mongoose |
| Database           | MongoDB                  |

## Preview

![Hero Section](./references/hero.png)
![Theme System UI](./references/theme-system.webp)

## Key Features

### Visual System

- Terminal loader with ASCII art
- SVG text animations
- Custom cursor with trails
- 3D tilt effects
- Warm amber "Midnight Sun" background

### Navigation

- Vertical sidebar with vertical text
- Custom scrollbar with range input
- 3D page transitions

### Interactive Elements

- Mini terminal easter eggs (whoami, chef, journalist, skills)
- Hidden commands (matrix, sudo, coffee)
- Konami code detection
- Career timeline with scroll-triggered SVG path
- Filterable project grid with stat counters
- Terminal-styled contact form
- **Authentication system** with terminal-styled login UI
- **Admin dashboard** with CRUD interface for projects

### Authentication System

- JWT-based authentication with bcrypt password hashing
- Terminal-styled login/register forms with animations
- Protected admin routes with role-based access
- Admin dashboard for managing projects and content
- LocalStorage persistence with reactive state updates
- API endpoints: /api/users/login, /api/users/register, /api/users/profile

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
│   ├── 09-refactoring-v2.md
│   └── 10-semantic-theme-v3.md
├── documents/           # Original planning docs (.gitignore - not pushed)
├── references/          # Design references
└── README.md            # This file
```

## Documentation

Detailed documentation is organized in `/docs`:

| File                              | Description                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `docs/timeline.md`                | Chronological evolution by phases                                                               |
| `docs/01-project-overview.md`     | Project description and core technologies                                                       |
| `docs/02-initial-setup.md`        | Original MERN stack initialization                                                              |
| `docs/03-ui-refactoring.md`       | UI/UX enhancement phases 1-5 (Terminal aesthetic, SVG text, 3D effects)                         |
| `docs/04-styling-evolution.md`    | Color system evolution, OKLCH tokens, light/dark themes                                         |
| `docs/05-feature-enhancements.md` | Phases A-G (About, Work, Mini Terminal, Konami code, Blog, Resume, 404)                         |
| `docs/06-bugfixes-technical.md`   | Bug fixes (Lenis exposure, CustomScrollbar .get() warning, WebGL deprecation)                   |
| `docs/07-code-quality.md`         | Code standards, DRY patterns, component primitives                                              |
| `docs/08-future-improvements.md`  | Next steps (server-side integration, color refinements)                                         |
| `docs/09-refactoring-v2.md`       | V2 refactoring (TerminalHeader, BlinkingCursor, 4 custom hooks, API layer, primitives)          |
| `docs/10-semantic-theme-v3.md`    | **V3 semantic theme reconstruction** (6 phases, View Transitions API, forest→midnight palettes) |
| `docs/11-server-auth-implementation.md` | **Server authentication system** (JWT, bcrypt, MongoDB, terminal UI) |

## Current Development Status

### ✅ Completed

- Full frontend UI/UX system
- Animation system and design tokens
- Component architecture and refactoring (V2, V3)
- **Authentication system** (JWT + bcrypt + MongoDB)
- **Admin dashboard** with protected routes
- Terminal-styled login/register UI

### 📝 Todo

- Finalize color tokens re-touches
- Add more easter eggs to the mini-terminal
- Move projects from constants to MongoDB
- Cloudinary image upload integration

### 🔄 In Progress

- Full CRUD operations for admin dashboard
- Blog management system
- Production deployment setup

### 🎯 Next Milestones

- Complete full-stack CRUD for projects
- Implement image upload functionality
- Deploy full-stack version

### Key Files for Next Agent

**Authentication System:**

- `server/src/controllers/userController.js` - Login, register, profile logic
- `server/src/middleware/authMiddleware.js` - JWT verification
- `client/src/context/AuthProvider.jsx` - Global auth state management
- `client/src/components/auth/TerminalAuthForm.jsx` - Terminal UI

**Next Features:**

- `server/src/controllers/projectController.js` - Need full CRUD (currently static)
- `server/models/Project.js` - Ready for MongoDB integration
- `client/src/pages/AdminDashboard.jsx` - CRUD interface ready for API integration
- `client/src/pages/Contact.jsx` - Ready for real API integration

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

## Notable Engineering Decisions

- Replaced WebGL with CSS-based effects for performance
- Introduced OKLCH color system for better perceptual consistency
- Built reusable animation primitives using Framer Motion
- Structured documentation as a chronological system

## Organization Logic

The documentation was restructured from scattered planning files into a coherent narrative:

1. **Chronological:** `timeline.md` shows evolution from initial setup → phases 1-5 → phases A-G → V2 refactoring → **V3 semantic theme**
2. **Thematic:** Each numbered file focuses on a specific aspect (styling, UI, features, refactoring)
3. **Preserved:** Original documents in `/documents/` kept locally for reference but not pushed to remote
4. **Current State:** Future improvements prioritized by server-side work needed

---

See `docs/timeline.md` for the complete development journey.
