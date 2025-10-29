import { Star, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';

export default function XPDisplay() {
  const user = useStore((state) => state.user);

  if (!user) return null;

  const xpForNextLevel = (user.level * 1000);
  const currentLevelXP = user.totalXP % 1000;
  const progressToNextLevel = (currentLevelXP / 1000) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Level Badge */}
      <motion.div
        className="flex items-center gap-2 badge badge-level"
        whileHover={{ scale: 1.05 }}
      >
        <Trophy className="w-4 h-4" />
        <span className="font-bold">Level {user.level}</span>
      </motion.div>

      {/* XP Badge */}
      <motion.div
        className="flex items-center gap-2 badge badge-xp"
        whileHover={{ scale: 1.05 }}
      >
        <Star className="w-4 h-4" />
        <span className="font-bold">{user.totalXP} XP</span>
      </motion.div>

      {/* Streak Badge */}
      <motion.div
        className="flex items-center gap-2 badge badge-streak"
        whileHover={{ scale: 1.05 }}
      >
        <Flame className="w-4 h-4" />
        <span className="font-bold">{user.streak} day streak</span>
      </motion.div>

      {/* Progress to Next Level */}
      <div className="flex-1 min-w-[150px]">
        <div className="text-xs text-surface-600 mb-1">
          {currentLevelXP} / {1000} XP to Level {user.level + 1}
        </div>
        <div className="progress-bar h-2">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
