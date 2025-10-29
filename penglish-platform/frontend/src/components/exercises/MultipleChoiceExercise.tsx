import { useState } from 'react';
import { Exercise, ExerciseResult } from '@/types';
import Button from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import clsx from 'clsx';

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function MultipleChoiceExercise({
  exercise,
  onComplete,
}: MultipleChoiceExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const correct = selectedOption === exercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete({
      correct: isCorrect,
      userAnswer: selectedOption!,
      correctAnswer: exercise.correctAnswer,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-surface-900 mb-2">{exercise.question}</h2>
        {exercise.questionEnglish && (
          <p className="text-surface-600">{exercise.questionEnglish}</p>
        )}
      </motion.div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {exercise.options?.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !showResult && setSelectedOption(option)}
            disabled={showResult}
            className={clsx(
              'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
              'font-medium text-lg',
              selectedOption === option
                ? showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-primary-500 bg-primary-50'
                : 'border-surface-300 bg-white hover:border-primary-300 hover:bg-primary-50',
              showResult && option === exercise.correctAnswer && 'border-green-500 bg-green-50',
              showResult && 'cursor-not-allowed'
            )}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {showResult && option === exercise.correctAnswer && (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              )}
              {showResult && selectedOption === option && !isCorrect && (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Hint Button */}
      {exercise.hints && exercise.hints.length > 0 && !showResult && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium mb-4"
        >
          <Lightbulb className="w-5 h-5" />
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>
      )}

      {/* Hint */}
      <AnimatePresence>
        {showHint && exercise.hints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-accent-50 border-2 border-accent-200 rounded-xl"
          >
            <p className="text-accent-900 font-medium">{exercise.hints[0]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'mb-6 p-6 rounded-xl',
              isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
            )}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              )}
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {isCorrect ? 'Afareen! (Excellent!)' : 'Not quite right'}
                </h3>
                {!isCorrect && (
                  <p className="text-surface-700">
                    The correct answer is: <span className="font-bold">{exercise.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="flex-1"
            size="lg"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleContinue} className="flex-1" size="lg">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
