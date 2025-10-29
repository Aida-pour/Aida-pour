import { Lesson } from '@/types';
import Card from '@/components/common/Card';
import { Lock, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LessonCardProps {
  lesson: Lesson;
  completed?: boolean;
  score?: number;
  onClick?: () => void;
}

export default function LessonCard({ lesson, completed = false, score, onClick }: LessonCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <Card
      hover={!lesson.locked}
      onClick={lesson.locked ? undefined : onClick}
      className={lesson.locked ? 'opacity-60 cursor-not-allowed' : ''}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-surface-900 mb-1">{lesson.title}</h3>
            <p className="text-sm text-surface-600">{lesson.titleEnglish}</p>
          </div>

          {/* Status Icon */}
          {lesson.locked ? (
            <Lock className="w-6 h-6 text-surface-400" />
          ) : completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="w-6 h-6 text-primary-500" />
            </motion.div>
          ) : null}
        </div>

        {/* Description */}
        <p className="text-surface-700 text-sm">{lesson.description}</p>

        {/* Metadata */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Difficulty Badge */}
          <span className={`badge ${difficultyColors[lesson.difficulty]}`}>
            {lesson.difficulty}
          </span>

          {/* XP Reward */}
          <div className="flex items-center gap-1 text-sm font-semibold text-accent-600">
            <Star className="w-4 h-4 fill-current" />
            <span>+{lesson.xpReward} XP</span>
          </div>

          {/* Exercises Count */}
          <span className="text-sm text-surface-600">
            {lesson.exercises.length} exercises
          </span>

          {/* Score (if completed) */}
          {completed && score !== undefined && (
            <span className="text-sm font-semibold text-primary-600">Score: {score}%</span>
          )}
        </div>

        {/* Progress Indicator (if started but not completed) */}
        {!completed && !lesson.locked && (
          <div className="mt-2">
            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 w-0" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
