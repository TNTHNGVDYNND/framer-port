# Code Quality & Standards

## Coding Conventions

### React 19 Best Practices
- Use modern hooks
- Avoid deprecated patterns
- ES Modules only (`"type": "module"`)

### Styling Rules
- **No Inline Styles** - Use Tailwind classes or CSS variables
- Use Semantic Tailwind classes (e.g., `text-heading` not `text-lagoon`)
- Hybrid approach: Tailwind + Design Tokens

### Animation Guidelines
- Use `variants` with `staggerChildren` for coordinated animations
- Use `useSpring` for physics-based motion (mouse tracking)
- Use `useTransform` for reactive MotionValue mapping
- Use `layoutId` for smooth layout animations
- Avoid `.get()` during render (causes React warnings)

### Component Standards
- Small and focused
- Logic in custom hooks
- Accessibility: include `aria-labels`, respect `prefers-reduced-motion`

## Accessibility Requirements

- Skip-to-content link
- ARIA labels in interactive elements
- Keyboard navigation support
- Reduced motion support (`@media (prefers-reduced-motion)`)
- High contrast mode support
- Focus-visible styles

## Performance Guidelines

### Mouse Tracking
- Throttle event listeners
- Use requestAnimationFrame

### Scroll Animations
- Use Intersection Observer
- Lazy load heavy components

### Build
- Code splitting with React.lazy
- GPU acceleration (`will-change`, `translateZ(0)`)

## File Organization

### Frontend
```
client/src/
├── components/     # UI components
├── pages/          # Route pages
├── hooks/          # Custom hooks
├── styles/         # CSS + Design Tokens
├── services/       # API services
├── constants/      # Static data
└── context/        # React contexts
```

### Backend
```
server/
├── models/         # Mongoose schemas
├── controllers/   # Route handlers
├── routes/         # API routes
├── middleware/     # Express middleware
└── config/        # Configuration
```

## Validation Commands

```bash
# Frontend
cd client
npm run lint       # ESLint
npm run build      # Production build
npm run format     # Prettier

# Backend
cd server
npm run dev        # Nodemon
```

## Cleanup Guidelines

When removing unused files:
1. Run build/lint to check for breakages
2. Check all imports/exports
3. Test routes and API endpoints
4. Don't delete uncertain items - archive instead

## References

- See `documents/project-instructions.md` for technical persona
- See `documents/cleaning-prompts.md` for cleanup workflow
