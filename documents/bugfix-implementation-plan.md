# Bug Fix & Feature Implementation Plan

## Overview

Three tasks were planned:

1. ~~LangToggle.jsx - Language switcher (EN/DE/TH)~~ **REMOVED - Not needed**
2. CustomScrollbar fix - Use useTransform instead of .get() ✅ **COMPLETED**
3. Lenis context - Expose Lenis for scroll velocity tracking ✅ **COMPLETED**

---

## Implementation Status

| Task                | Status       | Notes                                    |
| ------------------- | ------------ | ---------------------------------------- |
| Lenis fix           | ✅ Completed | Added `window.lenis = lenis` to main.jsx |
| CustomScrollbar fix | ✅ Completed | Replaced `.get()` with `useTransform`    |
| LangToggle          | ❌ Removed   | User decided to use English only         |

---

## 1. Lenis Fix ✅ COMPLETED

### Issue with Window.Lenis

[`useScrollVelocity.js:22`](client/src/hooks/useScrollVelocity.js:22) tries to access `window.lenis`:

```jsx
if (typeof window !== "undefined" && window.lenis) {
  lenisRef.current = window.lenis;
}
```

But [`main.jsx`](client/src/main.jsx) didn't expose Lenis to window.

### Solution Implemented

Added one line to [`main.jsx:20`](client/src/main.jsx:20):

```jsx
// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1,
});

// Expose Lenis to window for useScrollVelocity hook
window.lenis = lenis; // ✅ ADDED THIS LINE

// Lenis animation loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### Result: Lenis Exposure

The `useScrollVelocity` hook can now access Lenis velocity for smooth scroll-based WebGL effects.

---

## 2. CustomScrollbar Fix ✅ COMPLETED

### Issue with .get() During Render

[`CustomScrollbar.jsx:48`](client/src/components/CustomScrollbar.jsx:48) used `.get()` during render:

```jsx
value={scrollYProgress.get() * 100}  // ❌ Called during render - causes React warnings
```

Calling `.get()` on a MotionValue during render is problematic because:

1. It doesn't subscribe to changes (won't re-render on updates)
2. It can cause React warnings about reading state during render
3. It breaks the reactive pattern of Framer Motion

### Solution Implemented for CustomScrollbar

Rewrote [`CustomScrollbar.jsx`](client/src/components/CustomScrollbar.jsx) to use `useTransform`:

```jsx
import { motion, useScroll, useTransform } from "framer-motion";

const CustomScrollbar = () => {
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to thumb position
  const thumbY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "calc(100vh - 48px)"],
  );

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value) / 100;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: value * maxScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-8 z-50 flex items-center justify-center">
      {/* Track background */}
      <div
        className="absolute right-3 top-6 bottom-6 w-0.5 rounded-full"
        style={{ backgroundColor: "var(--color-neutral-200)" }}
      >
        <motion.div
          className="w-full rounded-full origin-top"
          style={{
            height: "100%",
            scaleY: scrollYProgress, // ✅ MotionValue directly - reactive
            backgroundColor: "var(--color-lagoon)",
          }}
        />
      </div>

      {/* Invisible range input for interaction */}
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        className="absolute right-0 top-0 bottom-0 w-8 opacity-0 cursor-pointer"
        onChange={handleSliderChange}
        defaultValue={0} // ✅ Use defaultValue instead of value={...get()}
        aria-label="Scroll progress"
      />

      {/* Thumb indicator */}
      <motion.div
        className="absolute right-2 w-3 h-3 rounded-full pointer-events-none"
        style={{
          backgroundColor: "var(--color-lagoon)",
          y: thumbY, // ✅ useTransform - reactive
        }}
      />
    </div>
  );
};

export default CustomScrollbar;
```

### Key Changes

1. Removed `useMotionValue` and `useEffect` for syncing
2. Changed `value={scrollYProgress.get() * 100}` to `defaultValue={0}`
3. Used `useTransform` for thumb position: `const thumbY = useTransform(scrollYProgress, [0, 1], ['0%', 'calc(100vh - 48px)'])`
4. Simplified the component by removing unnecessary state management

### Result

The scrollbar now properly reacts to scroll changes without React warnings.

---

## 3. LangToggle ❌ REMOVED

### Original Plan

Create a language switcher with EN/DE/TH support:

- `context/LanguageContext.jsx` - Provider with translations
- `components/LangToggle.jsx` - Toggle button component
- `locales/*.json` - Translation files

### Implementation (Temporary)

The language system was fully implemented:

1. Created `LanguageContext.jsx` with translations for EN/DE/TH
2. Created `LangToggle.jsx` with dropdown UI
3. Added LangToggle to Navbar sidebar
4. Wrapped app in LanguageProvider

### Decision to Remove

User decided: _"I don't think I need these context. We will just use english language"_

### Files Deleted

- ❌ `client/src/context/LanguageContext.jsx` - Deleted
- ❌ `client/src/components/LangToggle.jsx` - Deleted

### Files Modified

- [`client/src/components/Navbar.jsx`](client/src/components/Navbar.jsx) - Removed LangToggle import and usage
- [`client/src/main.jsx`](client/src/main.jsx) - Removed LanguageProvider wrapper

### Result

The codebase now uses English only, with no language context overhead.

---

## Final File Changes Summary

| File                             | Action                     | Status     |
| -------------------------------- | -------------------------- | ---------- |
| `main.jsx`                       | Add `window.lenis = lenis` | ✅ Done    |
| `main.jsx`                       | Remove LanguageProvider    | ✅ Done    |
| `components/CustomScrollbar.jsx` | Fix with useTransform      | ✅ Done    |
| `components/Navbar.jsx`          | Remove LangToggle          | ✅ Done    |
| `context/LanguageContext.jsx`    | Create then Delete         | ❌ Removed |
| `components/LangToggle.jsx`      | Create then Delete         | ❌ Removed |

---

## Testing Recommendations

1. **Test Lenis integration**: Scroll the page and verify WebGL background responds to scroll velocity
2. **Test CustomScrollbar**:
   - Drag the scrollbar to navigate
   - Verify thumb position syncs with scroll
   - Check browser console for React warnings (should be none)
3. **Verify no language imports**: Ensure no components import from deleted language files
