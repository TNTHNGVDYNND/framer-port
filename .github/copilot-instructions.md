# Project Context: High-End Interactive Portfolio

## 1. Technical Persona

You are a Senior Creative Technologist. Your goal is to provide code that is high-performance, modular, and visually sophisticated.

## 2. Core Tech Stack

- **Framework:** React 19 (Use modern hooks, avoid deprecated patterns).
- **Styling:** Tailwind CSS v4 (Use the `@theme` directive and semantic variables like `text-heading` or `text-dusk`). No inline styles.
- **Animation:** Framer Motion v12 (Prioritize `variants`, `staggerChildren`, and `useSpring` for physics-based motion).
- **Routing:** React Router v7.
- **Build Tool:** Vite (ESM only).

## 3. Design Language & Aesthetic

- **Theme:** Terminal-inspired, "Midnight Sun" aesthetic (OKLCH colors).
- **Typography:** Character-by-character SVG animations and monospace font stacks (JetBrains Mono).
- **Elements:** Heavy use of barcodes, terminal outputs, 3D tilt effects, and custom cursors.
- **Backgrounds:** Advanced CSS-only effects (grain, blur, radial gradients) over heavy WebGL.

## 4. Implementation Rules

- **No Inline Styles:** Use Tailwind classes or CSS variables in `theme.css`.
- **Accessibility:** Always include `aria-labels` and respect `prefers-reduced-motion`.
- **Performance:** Throttling for mouse-tracking hooks; use `Intersection Observer` for scroll animations.
- **Organization:** Follow the Controller-Service-Model for the backend and a strict component-based architecture for the frontend.

## 5. Interaction Requests

When I ask for "Ideas" or "Improvements," prioritize:

- SVG Filter effects (displacement maps, noise, turbulence).
- Advanced Framer Motion sequences (AnimatePresence transitions).
- Low-overhead GPU-accelerated CSS animations.

### Update Instructions

Optimizing tool selection...

Read [](file:///home/vladi/developer/framer-port/client/src/components/ProjectGrid.jsx#1-1), lines 1 to 50

Read [](file:///home/vladi/developer/framer-port/client/src/components/ProjectCard.jsx#1-1), lines 1 to 50

Read [](file:///home/vladi/developer/framer-port/documents/UI-FE-V1.md#1-1), lines 1 to 50

Read [](file:///home/vladi/developer/framer-port/client/src/styles/background-effects.css#1-1), lines 1 to 50

Read [](file:///home/vladi/developer/framer-port/client/src/components/TerminalLoader.jsx#1-1), lines 1 to 50

Searched for text `Hero` (`**/*.jsx`), 16 results

Read [](file:///home/vladi/developer/framer-port/client/src/components/Hero.jsx#1-1), lines 1 to 100

Read [](file:///home/vladi/developer/framer-port/client/src/components/Hero.jsx#101-101), lines 101 to 200

Read [](file:///home/vladi/developer/framer-port/client/src/components/Hero.jsx#201-201), lines 201 to 300

Read [](file:///home/vladi/developer/framer-port/client/src/components/TerminalLoader.jsx#51-51), lines 51 to 100

Read [](file:///home/vladi/developer/framer-port/client/src/components/TerminalLoader.jsx#101-101), lines 101 to 150

Read [](file:///home/vladi/developer/framer-port/client/src/components/TerminalLoader.jsx#151-151), lines 151 to 200

### Task 1: Enhancing the 'Midnight Sun' Glow with SVG Turbulence

Based on your Hero.jsx, the background uses an animated radial gradient for the glow effect. To add a 'steamy/organic' feel without WebGL, you can apply an SVG turbulence filter directly to the background element. This builds on the existing grain effect in your background-effects.css (which already uses `feTurbulence` for film grain).

**Suggested Implementation:**
Create an SVG filter definition in your `theme.css` or a new SVG component, then apply it via CSS `filter` on the gradient background div. Use animated turbulence for an organic, heat-haze effect.

```css
/* Add to theme.css or background-effects.css */
.steam-filter {
  filter: url(#steam-turbulence);
}

@keyframes steam-shift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(2px, -1px) scale(1.02);
  }
  50% {
    transform: translate(-1px, 2px) scale(0.98);
  }
  75% {
    transform: translate(1px, 1px) scale(1.01);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
```

```html
<!-- Add this SVG to your Hero component or as a hidden element in index.html -->
<svg width="0" height="0" style="position: absolute;">
  <defs>
    <filter id="steam-turbulence" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.02 0.05"
        numOctaves="3"
        result="noise"
      >
        <animate
          attributeName="baseFrequency"
          values="0.02 0.05;0.03 0.06;0.02 0.05"
          dur="4s"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="5"
        xChannelSelector="R"
        yChannelSelector="G"
      />
      <feGaussianBlur stdDeviation="0.5" />
    </filter>
  </defs>
</svg>
```

**Apply to Hero.jsx:**
In the `motion.div` with the gradient (around line 85), add the class:

```jsx
<motion.div
  className='absolute inset-0 z-10 steam-filter'
  // ... existing props
>
```

This creates subtle, animated distortion that mimics steam rising from the 'Midnight Sun', enhancing the organic feel while keeping performance high (pure CSS/SVG, no WebGL overhead).

### Task 2: Optimizing Stagger Animation with Intersection Observer

Your ProjectCard.jsx and ProjectGrid.jsx already use `useInView` from your custom hook, but the stagger triggers at a low threshold (5% for the grid). To trigger only when cards are 20% in view, adjust the threshold and ensure the animation starts precisely then.

**Suggested Changes:**

In ProjectGrid.jsx, update the `useInView` call:

```jsx
const [ref, isInView] = useInView({ threshold: 0.2, once: true });
```

In ProjectCard.jsx, since cards are staggered children, remove the individual `useInView` (it's redundant with the container's) and rely on the parent's `isInView` to control the stagger. Update the container variants in ProjectGrid.jsx to only animate when `isInView` is true:

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.15, // Slightly increased for better pacing
      delayChildren: 0.1,
    },
  },
};

// In the return, conditionally apply variants
<motion.div
  ref={ref}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  variants={containerVariants}
  style={{ perspective: 1000 }}
>
  {projects.map((project, index) => (
    <ProjectCard key={project.id} project={project} index={index} />
  ))}
</motion.div>;
```

In ProjectCard.jsx, simplify by removing the local `useInView` and `isInView` logic, as the stagger will handle entry animations. This ensures the entire grid animates only when 20% visible, optimizing performance and user experience.

### Task 3: Surprise Interaction for Terminal-Style Loader

Based on your UI-FE-V1.md goals (emphasizing terminal aesthetics, system info, and interactive elements like Shoya Kajita's site), and your current TerminalLoader.jsx (which has typing logs, phases, and static system info), a standout 'surprise' interaction would be **an interactive command prompt** that lets users "hack" or query the system during loading. This showcases MERN-stack technical depth (e.g., real-time data fetching, event handling) and impresses recruiters by blending UX with backend-like interactivity.

**Suggested Implementation:**
Add a command input field at the loader's bottom. Users can type commands like "status" (show real browser metrics), "accelerate" (speed up loading), or "help" (list commands). This ties into your terminal theme and adds engagement without breaking the loader flow.

**Code Changes to TerminalLoader.jsx:**

Add state and handlers:

```jsx
const [command, setCommand] = useState("");
const [commandOutput, setCommandOutput] = useState([]);
const [isTyping, setIsTyping] = useState(false);

const handleCommand = (e) => {
  if (e.key === "Enter") {
    const cmd = command.toLowerCase().trim();
    let output = "";
    switch (cmd) {
      case "status":
        output = `Browser: ${navigator.userAgent.split(" ")[0]}\nResolution: ${window.innerWidth}x${window.innerHeight}\nTime: ${new Date().toLocaleTimeString()}`;
        break;
      case "accelerate":
        // Speed up progress (impress with dynamic control)
        setProgress(100);
        output = "Loading accelerated...";
        break;
      case "help":
        output = "Available commands: status, accelerate, help";
        break;
      default:
        output = 'Command not recognized. Type "help" for options.';
    }
    setCommandOutput((prev) => [...prev, `> ${command}`, output]);
    setCommand("");
  }
};
```

Add the input below the progress bar:

```jsx
{
  /* Interactive Command Prompt */
}
<div className="mt-4">
  <div className="text-xs text-neutral-500 mb-2">Type a command:</div>
  <div className="flex items-center gap-2">
    <span className="text-lagoon">$</span>
    <input
      type="text"
      value={command}
      onChange={(e) => setCommand(e.target.value)}
      onKeyDown={handleCommand}
      className="flex-1 bg-transparent border-none outline-none text-text-primary font-mono text-xs"
      placeholder='Try "status" or "help"'
      autoFocus
    />
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
      className="w-2 h-4 bg-lagoon"
    />
  </div>
  <div className="mt-2 max-h-20 overflow-y-auto text-xs font-mono">
    {commandOutput.map((line, i) => (
      <div key={i} className="text-neutral-500">
        {line}
      </div>
    ))}
  </div>
</div>;
```

This adds a layer of interactivity that feels like a real terminal, demonstrating your ability to handle user input, state management, and real-time updates—key skills for a MERN developer. Recruiters will appreciate the technical flair and attention to detail!
