'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedContainer({ children, className }: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

export function AnimatedItem({ children, className, as = 'div' }: AnimatedItemProps) {
  const Component = motion[as];
  
  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </Component>
  );
}