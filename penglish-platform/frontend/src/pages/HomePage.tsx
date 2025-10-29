import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lessonUnits } from '@/data/lessons';
import LessonCard from '@/components/lessons/LessonCard';
import XPDisplay from '@/components/common/XPDisplay';
import { useStore } from '@/store';
import { BookOpen, Sparkles } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const progress = useStore((state) => state.progress);

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-surface-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Penglish</h1>
                <p className="text-sm text-surface-600">Learn Farsi the fun way</p>
              </div>
            </div>

            {user && (
              <div className="text-right">
                <p className="text-lg font-semibold text-surface-900">
                  Salam, {user.displayName}!
                </p>
                <p className="text-sm text-surface-600">Keep up the great work!</p>
              </div>
            )}
          </div>

          {/* XP Display */}
          {user && (
            <div className="mt-4">
              <XPDisplay />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-2xl p-6 shadow-float"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-surface-900 mb-2">
                Welcome to Your Farsi Learning Journey!
              </h2>
              <p className="text-surface-700">
                Learn Farsi using <span className="font-semibold text-primary-600">Penglish</span>{' '}
                (romanized Persian). Master pronunciation and meaning before learning the alphabet.
                Start with greetings and work your way up to fluent conversations!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Lesson Units */}
        <div className="space-y-12">
          {lessonUnits.map((unit, unitIndex) => (
            <motion.section
              key={unit.unit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: unitIndex * 0.1 }}
            >
              {/* Unit Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{unit.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-surface-900">
                    Unit {unit.unit}: {unit.title}
                  </h2>
                  <p className="text-surface-600">{unit.titleEnglish}</p>
                  <p className="text-sm text-surface-500 mt-1">{unit.description}</p>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unit.lessons.map((lesson, lessonIndex) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: unitIndex * 0.1 + lessonIndex * 0.05 }}
                  >
                    <LessonCard
                      lesson={lesson}
                      completed={progress[lesson.id]?.completed}
                      score={progress[lesson.id]?.score}
                      onClick={() => handleLessonClick(lesson.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Coming Soon Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl px-8 py-6">
            <h3 className="text-xl font-bold text-surface-900 mb-2">More Coming Soon!</h3>
            <p className="text-surface-700">
              New units on food, travel, daily conversations, and more are on the way!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
