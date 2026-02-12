# UI/UX Refactoring Blueprint - MyPortfolio

## Current State Analysis

### Original MyPortfolio:
- ✅ Modern React 19 + Tailwind v4 + Framer Motion
- ✅ Component-based architecture
- ✅ Dark theme system with OKLCH colors
- ✅ Multi-stage animations (preloader, curtain)
- ❌ Standard web fonts (not SVG typography)
- ❌ Basic loading screen (not terminal-style)
- ❌ Traditional horizontal navbar
- ❌ Native browser scrollbar
- ❌ No gesture controls or 3D elements

### Shoya Kajita Site (Inspiration): https://shoya-kajita.com/
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

## Refactoring Plan - Phases

### Phase 1: Foundation & Visual Identity (3-4 days)
**Goal:** Establish the technical/terminal aesthetic

#### 1. Typography System Overhaul
- Convert hero title to SVG letter animations
- Create `SvgText.jsx` component for animated character-by-character reveals
- Implement monospace/terminal font stack (Roboto Mono, JetBrains Mono)

#### 2. Loading Screen Enhancement
- Replace current preloader with terminal-style loader
- Add "system info" display with loading steps
- Show mock "environment variables" during load
- Implement barcode graphic element in loader

#### 3. Design System Updates
- Add barcode SVG component for decorative elements
- Create `Barcode.jsx` component
- Update Tailwind theme with terminal colors
- Add structured data/schema.org markup to pages

### Phase 2: Navigation & Controls (3-4 days)
**Goal:** Implement custom navigation and interface elements

#### 4. Navigation Redesign
- Transform horizontal navbar to vertical left sidebar
- Fix position with backdrop blur
- Update active link indicator to vertical sliding bar
- Add language toggle (JP/EN) component

#### 5. Custom Scrollbar Implementation
- Build `CustomScrollbar.jsx` component with range input
- Replace native scrollbars site-wide
- Style to match terminal aesthetic

#### 6. Audio System
- Add sound/audio toggle button
- Create `AudioToggle.jsx` component
- Hook up to future audio elements (video, hover sounds)

### Phase 3: Hero & Content Enhancement (4-5 days)
**Goal:** Elevate the hero section with advanced animations

#### 7. Hero Section Refactor
- Enhance current staggered text with SVG letter paths
- Add atmosphere/gradient background animation
- Implement 3D tilt effects on hero elements
- Add barcode decoration elements

#### 8. Project Gallery Upgrade
- Convert horizontal scroll to interactive 3D grid
- Add tilt parallax effects on project cards
- Implement video previews with custom controls

#### 9. Page Transitions
- Enhance AnimatePresence transitions with 3D effects
- Add route-specific entry/exit animations

### Phase 4: Advanced Interactions (5-7 days)
**Goal:** Implement cutting-edge interaction features

#### 10. Hand Gesture Controls (Research & POC)
- Integrate MediaPipe for hand tracking
- Enable camera access UI flow
- Implement basic pointer control
- Research feasibility for full implementation

#### 11. Enhanced Cursor & Hover Effects
- Custom cursor with trail effects
- Magnetic hover on interactive elements
- Ripple click effects
- 3D depth on cards

#### 12. Video & 3D Elements
- Add video backgrounds to sections
- Implement WebGL shader effects
- Create 3D project showcases using three.js

### Phase 5: Polish & Deployment (3-4 days)
**Goal:** Final polish and performance optimization

#### 13. Modals & Documentation
- Add "How to Use" modals
- Create instructions for gesture controls
- Implement loading states for all interactions

#### 14. Performance Optimization
- Lazy load heavy 3D libraries
- Optimize animations with proper will-change
- Implement intersection observers

#### 15. Accessibility & Testing
- Ensure keyboard navigation works
- Add fallback for unsupported browsers
- Test on multiple devices

---

## Key Components to Create

### New Components:
- `SvgText.jsx` - Animated SVG typography
- `TerminalLoader.jsx` - Enhanced loading screen
- `Barcode.jsx` - Decorative barcode graphics
- `CustomScrollbar.jsx` - Scrollbar replacement
- `AudioToggle.jsx` - Sound control
- `LangToggle.jsx` - Language switcher
- `Cursor.jsx` - Custom cursor with effects
- `HandGestureController.jsx` - MediaPipe integration

### Enhanced Components:
- `Navbar.jsx` → Vertical sidebar redesign
- `Hero.jsx` → SVG typography + 3D effects
- `ProjectCard.jsx` → Tilt + video preview
- `Layout.jsx` → Global gesture/state management

---

## Implementation Order Recommendation

1. **Start with Phase 1** to quickly establish the visual identity. The SVG typography and terminal loader will provide immediate visual impact with manageable complexity.

2. **Next, Phase 2** to improve navigation and user control elements. These are self-contained features.

3. **Phase 3** will be the most visible improvements to all content sections.

4. **Phase 4** contains the advanced features (gestures, 3D). In this phase it can treat these as stretch goals or implement incrementally based on time/effort.

5. **Phase 5** final polish.

---

## Technical Implementation Details

### Phase 1: Foundation & Visual Identity

#### 1. Typography System Overhaul

**Approach:**
- Use Framer Motion's variants with staggerChildren pattern
- Split text into individual characters via `text.split("")`
- Wrap each character in `<motion.span>` with animation variants
- For SVG paths: use pathLength animation with strokeDasharray/strokeDashoffset

**Implementation Pattern:**

```jsx
// SvgText.jsx
import { motion } from 'framer-motion'

const SvgText = ({ text, className }) => {
  const letters = text.split("")
  
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // Stagger delay per character
        duration: 0.5,
      }
    })
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default SvgText
```

**Font Stack:** Use monospace fonts - JetBrains Mono, Roboto Mono, or Fira Code for terminal aesthetic

**Add to tailwind.config.js:**
```javascript
fontFamily: {
  mono: ['JetBrains Mono', 'Roboto Mono', 'monospace']
}
```

---

#### 2. Loading Screen Enhancement

**Approach:** Use `@envoy1084/react-terminal` package for terminal-style loader

**Installation:**
```bash
npm install @envoy1084/react-terminal
```

**Implementation Pattern:**

```jsx
// TerminalLoader.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, TypingAnimation, TerminalOutput } from '@envoy1084/react-terminal'
import Barcode from './Barcode'

const TerminalLoader = ({ onComplete }) => {
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const phases = [
    'Loading environment...',
    'Initializing WebGL...',
    'Optimizing render pipeline...',
    'Loading assets...',
    'Ready to launch...'
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
      
      setLoadingPhase(Math.floor((progress / 100) * phases.length))
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl p-8">
        <Terminal>
          <TypingAnimation>WELCOME</TypingAnimation>
          <TerminalOutput>
            NAME: Your Name{'\n'}
            ROLE: Developer{'\n'}
            FIELD: Interactive / Website / CG
          </TerminalOutput>
          
          {phases.slice(0, loadingPhase + 1).map((phase, i) => (
            <TerminalOutput key={i}>{phase}</TerminalOutput>
          ))}
          
          <TerminalOutput>
            Progress: [{Array(20).fill(progress > (i * 5) ? '█' : '░').join('')}]
          </TerminalOutput>
        </Terminal>
        
        <div className="mt-8 flex justify-center">
          <Barcode value="LOADING" className="w-48" />
        </div>
      </div>
    </motion.div>
  )
}

export default TerminalLoader
```

---

#### 3. Design System Updates (Barcode Component)

**Approach:** Use `react-barcodes` npm package

**Installation:**
```bash
npm install react-barcodes
```

**Implementation Pattern:**

```jsx
// Barcode.jsx
import { useBarcode } from 'react-barcodes'
import { motion } from 'framer-motion'

const Barcode = ({ value, className = '' }) => {
  const { inputRef } = useBarcode({
    value: value || 'PORTFOLIO',
    options: {
      format: 'CODE128',
      width: 2,
      height: 40,
      displayValue: false,
      background: 'transparent',
      lineColor: '#ffffff',
    }
  })

  return (
    <motion.svg
      ref={inputRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  )
}

export default Barcode
```

**Barcode Types:** CODE128 recommended for alphanumeric codes used in portfolios

---

### Package Dependencies Required:

```json
{
  "dependencies": {
    "framer-motion": "^12.23.24",
    "@envoy1084/react-terminal": "^1.0.0",
    "react-barcodes": "^1.2.0"
  }
}
```

---

### Phase 2: Navigation & Controls

#### 4. Navigation Redesign

**Approach:** Transform horizontal navbar to vertical left sidebar using Framer Motion variants

**Implementation Pattern:**

```jsx
// Sidebar.jsx
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'HOME' },
    { path: '/about', label: 'ABOUT' },
    { path: '/works', label: 'WORKS' },
    { path: '/contact', label: 'CONTACT' }
  ]

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <motion.nav
      className="fixed left-0 top-0 bottom-0 w-20 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center py-8"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-12">
        <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
      </div>
      
      <ul className="flex flex-col gap-8">
        {menuItems.map((item) => (
          <motion.li key={item.path} variants={itemVariants}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                relative px-4 py-2 text-sm font-mono tracking-wider
                transition-colors duration-300
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <span className="vertical-text" style={{ writingMode: 'vertical-rl' }}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}

export default Sidebar
```

**Active Link Indicator:** Uses `motion.div` with `layoutId` for smooth sliding bar animation

---

#### 5. Custom Scrollbar Implementation

**Approach:** Build CustomScrollbar.jsx with range input using Framer Motion

**Implementation Pattern:**

```jsx
// CustomScrollbar.jsx
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

const CustomScrollbar = () => {
  const { scrollYProgress } = useScroll()
  const scaleY = useMotionValue(0)
  
  // Update scaleY based on scroll progress
  useEffect(() => {
    return scrollYProgress.onChange(v => scaleY.set(v))
  }, [scrollYProgress])

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value) / 100
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: value * maxScroll,
      behavior: 'smooth'
    })
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-8 bg-slate-900/50 z-50 flex items-center justify-center">
      {/* Progress bar background */}
      <div className="absolute right-2 top-4 bottom-4 w-1 bg-slate-700 rounded-full">
        <motion.div
          className="w-full bg-blue-500 rounded-full origin-top"
          style={{
            height: '100%',
            scaleY: scrollYProgress,
          }}
        />
      </div>
      
      {/* Range input for interaction */}
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        className="absolute right-0 top-0 bottom-0 w-8 opacity-0 cursor-pointer"
        onChange={handleSliderChange}
        value={scrollYProgress.get() * 100}
      />
    </div>
  )
}

export default CustomScrollbar
```

---

#### 6. Audio System

**Approach:** Create AudioToggle.jsx component with useState and Framer Motion

**Implementation Pattern:**

```jsx
// AudioToggle.jsx
import { useState, createContext, useContext } from 'react'
import { motion } from 'framer-motion'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [audioContext, setAudioContext] = useState(null)
  
  const toggleAudio = () => {
    if (!isAudioOn && !audioContext) {
      // Initialize Web Audio API
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      setAudioContext(ctx)
    }
    setIsAudioOn(!isAudioOn)
  }
  
  const playHoverSound = () => {
    if (!isAudioOn || !audioContext) return
    // Play subtle hover sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    gainNode.gain.value = 0.1
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.05)
  }

  return (
    <AudioContext.Provider value={{ isAudioOn, toggleAudio, playHoverSound }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => useContext(AudioContext)

// Audio Toggle Button Component
const AudioToggle = () => {
  const { isAudioOn, toggleAudio } = useAudio()
  
  const buttonVariants = {
    on: { 
      backgroundColor: "#10b981",
      scale: 1.05
    },
    off: { 
      backgroundColor: "#334155",
      scale: 1
    }
  }

  return (
    <motion.button
      variants={buttonVariants}
      animate={isAudioOn ? "on" : "off"}
      onClick={toggleAudio}
      className="fixed bottom-4 left-24 z-50 px-4 py-2 rounded-full font-mono text-sm text-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        initial={false}
        animate={{ opacity: isAudioOn ? 1 : 0.5 }}
      >
        Sound: {isAudioOn ? "On" : "Off"}
      </motion.span>
    </motion.button>
  )
}

export default AudioToggle
```

---

### Phase 3: Hero & Content Enhancement

#### 7. Hero Section Refactor

**SVG Letter Paths Animation:**

```jsx
// Hero.jsx
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'
import SvgText from './SvgText'
import Barcode from './Barcode'

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    
    mouseX.set((clientX - innerWidth / 2) / (innerWidth / 2))
    mouseY.set((clientY - innerHeight / 2) / (innerHeight / 2))
  }
  
  // Smooth spring animations for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [10, -10]), {
    stiffness: 150,
    damping: 20
  })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), {
    stiffness: 150,
    damping: 20
  })

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        perspective: 1000
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #1e3a8a 0%, #000000 100%)",
            "radial-gradient(circle at 80% 50%, #1e3a8a 0%, #000000 100%)",
            "radial-gradient(circle at 50% 20%, #1e3a8a 0%, #000000 100%)",
            "radial-gradient(circle at 20% 50%, #1e3a8a 0%, #000000 100%)"
          ]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear"
        }}
      />
      
      {/* 3D tilt container */}
      <motion.div
        className="relative z-10 text-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Main title with SVG letter animation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SvgText 
            text="YOUR NAME" 
            className="text-6xl md:text-8xl font-mono font-bold text-white tracking-tighter"
          />
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-slate-400 font-mono mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Developer / Interactive / Creative
        </motion.p>
        
        {/* Barcode decoration */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Barcode value="WELCOME-001" className="w-64" />
        </motion.div>
      </motion.div>
      
      {/* Floating elements for depth */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.section>
  )
}

export default Hero
```

---

#### 8. Project Gallery Upgrade

**Implementation Pattern:**

```jsx
// ProjectCard.jsx
import { motion } from 'framer-motion'
import { useState } from 'react'
import Barcode from './Barcode'

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      rotateX: -15 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    }
  }

  return (
    <motion.div
      className="relative group cursor-pointer"
      variants={cardVariants}
      whileHover={{ scale: 1.02, z: 50 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Card container with 3D tilt */}
      <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        {/* Image with parallax effect */}
        <motion.div
          className="relative h-64 overflow-hidden"
          animate={{
            y: isHovered ? -5 : 0,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        {/* Content overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
        >
          <h3 className="text-xl font-mono font-bold text-white mb-2">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            {project.description}
          </p>
          <div className="flex gap-2">
            {project.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
        
        {/* Barcode decoration */}
        <div className="absolute bottom-2 right-2 opacity-50">
          <Barcode value={project.id} className="w-24" />
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
```

**3D Grid Layout:**

```jsx
// ProjectGrid.jsx
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

const ProjectGrid = ({ projects }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        perspective: 1000
      }}
    >
      {projects.map((project, index) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          index={index}
        />
      ))}
    </motion.div>
  )
}

export default ProjectGrid
```

---

#### 9. Page Transitions

**Implementation Pattern:**

```jsx
// PageTransition.jsx
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const pageVariants = {
  initial: {
    opacity: 0,
    rotateX: -15,
    scale: 0.95,
    y: 50
  },
  in: {
    opacity: 1,
    rotateX: 0,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.5
    }
  },
  out: {
    opacity: 0,
    rotateX: 15,
    scale: 0.95,
    y: -50,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

const PageTransition = ({ children }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d"
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
```

**Usage in AppRoutes.jsx:**

```jsx
// AppRoutes.jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'

const AppRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PageTransition>
              <About />
            </PageTransition>
          } 
        />
        <Route 
          path="/works" 
          element={
            <PageTransition>
              <Works />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  )
}

export default AppRoutes
```

---

## Additional Configuration

### Update Layout.jsx

```jsx
// Layout.jsx
import { useState } from 'react'
import Sidebar from './Sidebar'
import CustomScrollbar from './CustomScrollbar'
import AudioToggle from './AudioToggle'
import TerminalLoader from './TerminalLoader'

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <TerminalLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
        <div className="flex min-h-screen bg-black">
          <Sidebar />
          <main className="flex-1 ml-20">
            {children}
          </main>
          <CustomScrollbar />
          <AudioToggle />
        </div>
      )}
    </>
  )
}

export default Layout
```

---

## Final Package Dependencies Summary

```json
{
  "dependencies": {
    "framer-motion": "^12.23.24",
    "@envoy1084/react-terminal": "^1.0.0",
    "react-barcodes": "^1.2.0"
  }
}
```

---

## Implementation Checklist for Kimi K2.5

### Phase 1 Tasks:
- [ ] Install new dependencies: `@envoy1084/react-terminal`, `react-barcodes`
- [ ] Create `SvgText.jsx` component with character-by-character animation
- [ ] Create `TerminalLoader.jsx` with terminal-style loading screen
- [ ] Create `Barcode.jsx` component using react-barcodes
- [ ] Update Tailwind config with monospace font stack
- [ ] Add terminal colors to theme system

### Phase 2 Tasks:
- [ ] Refactor `Navbar.jsx` to vertical sidebar with Framer Motion variants
- [ ] Create `CustomScrollbar.jsx` with range input
- [ ] Create `AudioToggle.jsx` with Web Audio API integration
- [ ] Add `AudioProvider` context for global audio state
- [ ] Test sidebar active link indicator with layoutId

### Phase 3 Tasks:
- [ ] Refactor `Hero.jsx` with 3D tilt effects and SVG text
- [ ] Create `ProjectCard.jsx` with 3D hover effects and parallax
- [ ] Create `ProjectGrid.jsx` with staggered animations
- [ ] Create `PageTransition.jsx` wrapper component
- [ ] Update `AppRoutes.jsx` to use AnimatePresence
- [ ] Add barcode decorations to hero and project cards

### General Tasks:
- [ ] Wrap app with AudioProvider in main.jsx
- [ ] Update Layout.jsx to include all new components
- [ ] Test all animations and interactions
- [ ] Ensure accessibility (keyboard navigation, focus states)
- [ ] Test on different screen sizes

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-12  
**Ready for Implementation:** Yes
