/**
 * Framer Motion preset configs — plain serialisable objects, no React dependency.
 *
 * Usage:
 *   Spread props:    <motion.div {...HOVER_SCALE} />
 *   Variants prop:   <motion.div variants={FADE_UP} initial="hidden" animate="visible" />
 *   Transition prop: <motion.div transition={SPRING_SOFT} />
 */

// ── Hover / tap interactions ─────────────────────────────────────────────────

export const HOVER_SCALE = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.97 },
};

export const HOVER_LIFT = {
  whileHover: { y: -4, scale: 1.02 },
};

// ── Appear variants (use with initial="hidden" + animate/whileInView="visible") ─

export const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const FADE_DOWN = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// ── Specialized Component Variants ───────────────────────────────────────────

/** Standard entry for project cards */
export const PROJECT_CARD_ENTRY = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -15,
    scale: 0.9,
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: index * 0.1,
    },
  }),
};

/** Standard entry for terminal windows and major sections */
export const SECTION_ENTRY = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// ── Stagger container variants ───────────────────────────────────────────────

export const STAGGER_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const STAGGER_SLOW = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// ── Spring transitions ────────────────────────────────────────────────────────

/** Soft, gentle spring — stiffness 150, damping 20 */
export const SPRING_SOFT = { type: 'spring', stiffness: 150, damping: 20 };

/** Snappy, responsive spring — stiffness 300, damping 30 */
export const SPRING_SNAPPY = { type: 'spring', stiffness: 300, damping: 30 };

// ── Tween transitions ─────────────────────────────────────────────────────────

export const TRANSITION_FAST = { duration: 0.15, ease: 'easeOut' };
export const TRANSITION_NORMAL = { duration: 0.3, ease: 'easeOut' };
export const TRANSITION_SLOW = { duration: 0.5, ease: 'easeInOut' };
