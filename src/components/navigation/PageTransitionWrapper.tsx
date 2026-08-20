import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMotionEngine } from './MotionEngineProvider';

interface PageTransitionWrapperProps {
  activeKey: string;
  children: React.ReactNode;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
  activeKey,
  children,
}) => {
  const { getPageTransition } = useMotionEngine();
  const transitionConfig = getPageTransition();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        initial={transitionConfig.initial}
        animate={transitionConfig.animate}
        exit={transitionConfig.exit}
        transition={transitionConfig.transition}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
