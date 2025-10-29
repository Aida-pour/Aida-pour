import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'accent' | 'success';
}

export default function ProgressBar({
  progress,
  className,
  showLabel = false,
  label,
  color = 'primary',
}: ProgressBarProps) {
  const colorClasses = {
    primary: 'from-primary-400 to-primary-600',
    accent: 'from-accent-400 to-accent-600',
    success: 'from-green-400 to-green-600',
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-medium text-surface-700">{label}</span>
          <span className="font-semibold text-primary-600">{clampedProgress}%</span>
        </div>
      )}
      <div className="progress-bar">
        <motion.div
          className={clsx('progress-fill bg-gradient-to-r', colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
