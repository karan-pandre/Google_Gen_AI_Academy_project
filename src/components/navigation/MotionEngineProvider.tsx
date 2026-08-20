import React, { createContext, useContext, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NAV_MOTION_TOKENS } from '../../lib/navigationTokens';

interface MotionEngineContextType {
  isReducedMotion: boolean;
  getSpringConfig: (type: 'snappy' | 'standard' | 'gentle' | 'drawer') => any;
  getPageTransition: () => any;
  getFadeTransition: () => any;
}

const MotionEngineContext = createContext<MotionEngineContextType>({
  isReducedMotion: false,
  getSpringConfig: () => ({ duration: 0.2 }),
  getPageTransition: () => ({ duration: 0.2 }),
  getFadeTransition: () => ({ duration: 0.15 }),
});

export const MotionEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemReducedMotion = useReducedMotion();
  const { isReducedMotion: userReducedMotion, setReducedMotion } = useNavigationStore();
  const [effectiveReducedMotion, setEffectiveReducedMotion] = useState(false);

  useEffect(() => {
    const isReduced = Boolean(systemReducedMotion || userReducedMotion);
    setEffectiveReducedMotion(isReduced);
    setReducedMotion(isReduced);
  }, [systemReducedMotion, userReducedMotion, setReducedMotion]);

  const getSpringConfig = (type: 'snappy' | 'standard' | 'gentle' | 'drawer') => {
    if (effectiveReducedMotion) {
      return { duration: 0.01 };
    }
    return NAV_MOTION_TOKENS.spring[type];
  };

  const getPageTransition = () => {
    if (effectiveReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.05 },
      };
    }
    return {
      initial: { opacity: 0, y: 8, scale: 0.995 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -8, scale: 0.995 },
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    };
  };

  const getFadeTransition = () => {
    if (effectiveReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.01 },
      };
    }
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15, ease: 'easeOut' },
    };
  };

  return (
    <MotionEngineContext.Provider
      value={{
        isReducedMotion: effectiveReducedMotion,
        getSpringConfig,
        getPageTransition,
        getFadeTransition,
      }}
    >
      {children}
    </MotionEngineContext.Provider>
  );
};

export const useMotionEngine = () => useContext(MotionEngineContext);
