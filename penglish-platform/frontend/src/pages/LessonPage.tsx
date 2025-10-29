import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonById } from '@/data/lessons';
import { ExerciseResult } from '@/types';
import { useStore } from '@/store';
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import FillBlankExercise from '@/components/exercises/FillBlankExercise';
import TranslateExercise from '@/components/exercises/TranslateExercise';
import ProgressBar from '@/components/common/ProgressBar';
import Button from '@/components/common/Button';
import { ArrowLeft, Star, Trophy } from 'lucide-react';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(getLessonById(lessonId!));
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const addXP = useStore((state) => state.addXP);
  const updateLessonProgress = useStore((state) => state.updateLessonProgress);

  useEffect(() => {
    if (!lesson) {
      navigate('/');
    }
  }, [lesson, navigate]);

  if (!lesson) return null;

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex) / lesson.exercises.length) * 100;

  const handleExerciseComplete = (result: ExerciseResult) => {
    const newResults = [...results, result];
    setResults(newResults);

    // Move to next exercise or show completion
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Lesson complete
      const correctCount = newResults.filter((r) => r.correct).length;
      const score = Math.round((correctCount / newResults.length) * 100);
      const xpEarned = Math.round((lesson.xpReward * score) / 100);

      // Update store
      addXP(xpEarned);
      updateLessonProgress(lesson.id, {
        completed: true,
        score,
        xpEarned,
        attempts: 1,
        lastAttemptDate: new Date(),
        id: lesson.id,
        userId: 'demo-user',
        lessonId: lesson.id,
      });

      setIsComplete(true);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setCurrentExerciseIndex(0);
    setResults([]);
    setIsComplete(false);
  };

  const renderExercise = () => {
    const key = `${currentExercise.id}-${currentExerciseIndex}`;

    switch (currentExercise.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceExercise
            key={key}
            exercise={currentExercise}
            onComplete={handleExerciseComplete}
          />
        );
      case 'fill_blank':
        return (
          <FillBlankExercise
            key={key}
            exercise={currentExercise}
            onComplete={handleExerciseComplete}
          />
        );
      case 'translate':
        return (
          <TranslateExercise
            key={key}
            exercise={currentExercise}
            onComplete={handleExerciseComplete}
          />
        );
      default:
        return <div>Exercise type not implemented yet</div>;
    }
  };

  if (isComplete) {
    const correctCount = results.filter((r) => r.correct).length;
    const score = Math.round((correctCount / results.length) * 100);
    const xpEarned = Math.round((lesson.xpReward * score) / 100);
    const isPerfect = score === 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-surface-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-3xl shadow-float p-8 text-center">
            {/* Trophy Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isPerfect ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-primary-400 to-primary-600'
                }`}
              >
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-surface-900 mb-2"
            >
              {isPerfect ? 'Aali! (Perfect!)' : 'Afareen! (Well done!)'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-surface-600 mb-8"
            >
              You've completed: <span className="font-semibold">{lesson.title}</span>
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-primary-600">{score}%</div>
                <div className="text-sm text-surface-600">Score</div>
              </div>
              <div className="bg-accent-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-accent-600 flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 fill-current" />
                  {xpEarned}
                </div>
                <div className="text-sm text-surface-600">XP Earned</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">
                  {correctCount}/{results.length}
                </div>
                <div className="text-sm text-surface-600">Correct</div>
              </div>
            </motion.div>

            {/* Feedback Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              {isPerfect && (
                <p className="text-surface-700 text-lg">
                  Amazing! You answered all questions correctly! You're mastering Penglish! 🎉
                </p>
              )}
              {score >= 80 && !isPerfect && (
                <p className="text-surface-700 text-lg">
                  Great job! You're making excellent progress in your Farsi learning journey! 👏
                </p>
              )}
              {score >= 60 && score < 80 && (
                <p className="text-surface-700 text-lg">
                  Good work! Keep practicing and you'll get even better! 💪
                </p>
              )}
              {score < 60 && (
                <p className="text-surface-700 text-lg">
                  Don't worry, learning takes time. Try again and you'll improve! 🌟
                </p>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <Button variant="secondary" onClick={handleRetry} className="flex-1">
                Practice Again
              </Button>
              <Button onClick={handleBackToHome} className="flex-1">
                Continue Learning
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-surface-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-surface-600 hover:text-surface-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="text-center flex-1 mx-4">
              <h1 className="text-xl font-bold text-surface-900">{lesson.title}</h1>
              <p className="text-sm text-surface-600">{lesson.titleEnglish}</p>
            </div>

            <div className="w-20 text-right">
              <span className="text-sm font-semibold text-surface-600">
                {currentExerciseIndex + 1} / {lesson.exercises.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar progress={progress} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderExercise()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
