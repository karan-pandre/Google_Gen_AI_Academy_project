// Namma Water - Motion Tokens & Animation Physics Presets
// Centralized motion primitives for high-performance React & Motion

export const MOTION_TIMINGS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  cinematic: 0.9,
};

export const MOTION_SPRINGS = {
  snappy: { type: 'spring', stiffness: 450, damping: 30 },
  standard: { type: 'spring', stiffness: 300, damping: 25 },
  soft: { type: 'spring', stiffness: 180, damping: 20 },
  bouncy: { type: 'spring', stiffness: 500, damping: 15 },
};

export const MOTION_EASINGS = {
  standard: [0.2, 0.0, 0.0, 1.0], // cubic-bezier
  emphasized: [0.4, 0.0, 0.2, 1.0],
  decelerate: [0.0, 0.0, 0.2, 1.0],
  accelerate: [0.4, 0.0, 1.0, 1.0],
};

export const STAGGER_PRESETS = {
  sm: 0.04,
  md: 0.08,
  lg: 0.14,
};

export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: MOTION_EASINGS.standard }
  }
};

export const SCALE_ENTER = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: MOTION_SPRINGS.standard
  }
};
