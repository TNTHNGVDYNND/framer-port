# Future Improvements

## Current Status

**Frontend:** Feature-complete with polished animations and UI

**Backend:** In progress - server-side debugging and finalization pending

## Server-Side Priorities

### 1. Contact Form Integration
- [ ] Create Contact Mongoose model
- [ ] Implement database persistence
- [ ] Connect frontend to real API endpoint
- [ ] Add server-side validation

### 2. Port Alignment
- [ ] Synchronize client/server ports via environment variables
- [ ] Ensure VITE_API_URL points to correct server port

### 3. API Refinement
- [ ] Complete /api/contact endpoint
- [ ] Test MongoDB connection
- [ ] Error handling improvements

## Visual Enhancements (Optional)

### 1. Color System Refinement

**Light Theme Improvements:**
- Consider warm white/cream gradient (`#faf8f5` to `#f5f0e8`)
- Add subtle warm amber accents
- Use same color family as dark theme but inverted lightness

### 2. Hero "Midnight Sun" Glow
- Add animated orange/gold radial gradient at top of Hero
- CSS-only with Framer Motion `animate` prop
- Should be Hero-specific, not global
- Example: `radial-gradient(ellipse at 50% 0%, rgba(255, 140, 0, 0.5) 0%, transparent 60%)`

### 3. Glass/Condensation Effects
- Subtle SVG filter for "wet glass" look
- Very subtle (opacity: 0.03-0.05)
- Enable on desktop only

### 4. Typography Contrast
- Test light theme text contrast
- Ensure WCAG AA compliance (4.5:1)

### 5. Subtle Parallax
- Add very subtle scroll parallax to background
- Movement: 20-30px max
- Disable for `prefers-reduced-motion`

## Technical Improvements

### 1. Package Updates
- Migrate from `react-barcodes` to `next-barcode`
- Keep dependencies current

### 2. Video Previews
- Add video preview support in ProjectCard
- Custom video controls

### 3. Testing
- Add unit tests for components
- Add integration tests for API

### 4. Deployment
- Optimize production build
- Set up CI/CD pipeline

## Documentation

- Update AGENTS.md with new components
- Add JSDoc comments to complex functions
- Create component storybook

---

*These are suggestions. The immediate focus is completing server-side integration.*
