import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Card({ children, hover = false, onClick, className }: CardProps) {
  const Component = onClick ? motion.div : 'div';

  return (
    <Component
      className={clsx('card', hover && 'card-hover', className)}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  );
}
