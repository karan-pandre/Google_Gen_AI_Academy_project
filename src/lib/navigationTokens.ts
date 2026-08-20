/**
 * Centralized Design & Motion Tokens for UNOS (Universal Navigation Operating System)
 */

export const NAV_DESIGN_TOKENS = {
  height: {
    desktop: '64px',
    mobile: '60px',
    floatingDock: '56px',
    contextualBar: '48px',
  },
  sidebarWidth: {
    expanded: '260px',
    collapsed: '72px',
  },
  zIndex: {
    base: 30,
    dock: 40,
    sticky: 50,
    dropdown: 60,
    drawer: 70,
    commandPalette: 100,
    tooltip: 110,
  },
  blur: {
    subtle: 'backdrop-blur-md',
    glass: 'backdrop-blur-xl',
    heavy: 'backdrop-blur-2xl',
  },
  shadow: {
    floating: '0 12px 32px -4px rgba(15, 23, 42, 0.18), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
    activePill: '0 2px 8px rgba(15, 118, 110, 0.25)',
    drawer: '0 -8px 32px rgba(15, 23, 42, 0.2)',
  },
  radius: {
    pill: '9999px',
    item: '0.75rem', // 12px
    container: '1rem', // 16px
    drawer: '1.5rem', // 24px
  },
} as const;

export const NAV_MOTION_TOKENS = {
  spring: {
    snappy: {
      type: "spring",
      stiffness: 450,
      damping: 32,
      mass: 0.8,
    },
    standard: {
      type: "spring",
      stiffness: 320,
      damping: 28,
      mass: 1,
    },
    gentle: {
      type: "spring",
      stiffness: 200,
      damping: 24,
      mass: 1.2,
    },
    drawer: {
      type: "spring",
      damping: 28,
      stiffness: 280,
      mass: 0.9,
    },
  },
  transition: {
    fast: { duration: 0.15, ease: [0.2, 0, 0, 1] },
    normal: { duration: 0.25, ease: [0.2, 0, 0, 1] },
    deliberate: { duration: 0.4, ease: [0.05, 0.7, 0.1, 1] },
  },
  stagger: {
    menuItems: 0.04,
    commandResults: 0.03,
  },
} as const;
