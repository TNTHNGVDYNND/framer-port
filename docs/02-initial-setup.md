# Initial Setup

## Original MERN Blueprint

The project was initialized as a standard MERN (MongoDB, Express, React, Node.js) stack application.

## Project Initialization

1. Created Git repository
2. Set up `.gitignore` for node_modules, build artifacts, environment variables
3. Created initial `GEMINI.md` blueprint

## Backend Setup (Server)

```bash
cd server
npm init -y
npm install express mongoose cors dotenv nodemon
```

### Configuration
- ES Modules enabled (`"type": "module"`)
- Basic Express server in `server.js` (runs on port **5000**, not 3001)
- RESTful API structure with Controller-Service-Model pattern
- **Note:** MongoDB connection in `server/server.js:23-30` is currently commented out

### Server Structure
```
server/
├── server.js              # Main entry, port 5000, MongoDB commented out
├── config/
│   └── db.js              # Database connection (unused when commented)
├── models/                # Mongoose schemas (need Contact model)
│   └── Project.js         # Existing project model
├── controllers/           # Route handlers
│   ├── projectController.js
│   └── contactController.js  # Placeholder implementation
├── routes/                # API routes
│   ├── projectRoutes.js
│   └── contactRoutes.js
└── middleware/            # Error handling, etc.
```

### Initial API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET | Fetch all projects |
| `/api/projects/:id` | GET | Fetch single project |
| `/api/contact` | POST | Handle contact form (placeholder) |

### Data Model

```javascript
// Project Model
{
  title: String,
  description: String,
  imageUrl: String,
  projectUrl: String,
  tags: [String]
}
```

## Frontend Setup (Client)

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install framer-motion react-router-dom
```

### Configuration
- Vite with ESM
- Tailwind CSS v4 integration via `@tailwindcss/vite` plugin
- ESLint for code quality

## Component Architecture

### Initial Components
- `Navbar.jsx` - Top navigation
- `Hero.jsx` - Landing view with animations
- `ProjectCard.jsx` - Project display card
- `ProjectList.jsx` - Grid container
- `ContactForm.jsx` - Contact form
- `Footer.jsx` - Site footer

### Layout Structure
- `Layout.jsx` - Main wrapper with Navbar + Outlet
- Client-side routing with React Router

## Animation Strategy

Framer Motion used for:
- Page transitions (smooth fades/slides)
- Scroll-triggered animations
- Micro-interactions (hover effects)

## Development Commands

```bash
# Frontend
cd client
npm run dev        # localhost:5173
npm run build      # Production build
npm run lint       # ESLint check
npm run format     # Prettier

# Backend
cd server
npm run dev        # Nodemon auto-restart
npm start          # Production
```

## Initial Progress

- [x] Project structure created
- [x] Backend API basic endpoints
- [x] React + Vite setup
- [x] Tailwind CSS integration
- [x] Component architecture
- [x] Basic animations

*This was the starting point. Subsequent phases added the terminal aesthetic and advanced features.*
