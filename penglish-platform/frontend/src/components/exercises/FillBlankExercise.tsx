import { useState } from 'react';
import { Exercise, ExerciseResult } from '@/types';
import Button from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface FillBlankExerciseProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function FillBlankExercise({ exercise, onComplete }: FillBlankExerciseProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const correct =
      userAnswer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete({
      correct: isCorrect,
      userAnswer: userAnswer.trim(),
      correctAnswer: exercise.correctAnswer,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      handleSubmit();
    }
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

      {/* Input Field */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => !showResult && setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={showResult}
          placeholder="Type your answer here..."
          className="input text-xl"
          autoFocus
        />
      </motion.div>

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
            className={`mb-6 p-6 rounded-xl ${
              isCorrect
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
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
                    The correct answer is:{' '}
                    <span className="font-bold">{exercise.correctAnswer}</span>
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
          <Button onClick={handleSubmit} disabled={!userAnswer.trim()} className="flex-1" size="lg">
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
