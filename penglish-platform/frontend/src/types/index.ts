// Core types for the Penglish Learning Platform

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  level: number;
  totalXP: number;
  streak: number;
  lastActiveDate: Date;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  unit: number;
  order: number;
  title: string; // Penglish title
  titleEnglish: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  exercises: Exercise[];
  locked: boolean;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'listening'
  | 'speaking'
  | 'matching'
  | 'translate';

export interface Exercise {
  id: string;
  type: ExerciseType;
  order: number;
  question: string; // Penglish or English
  questionEnglish?: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  audioUrl?: string; // For listening exercises
  hints?: string[];
  penglishText?: string; // For speaking exercises
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number; // 0-100
  attempts: number;
  lastAttemptDate: Date;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: Record<string, any>;
  xpReward: number;
  unlockedAt?: Date;
}

export interface LessonUnit {
  unit: number;
  title: string;
  titleEnglish: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface ExerciseResult {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  feedback?: string;
}

export interface LessonResult {
  lessonId: string;
  score: number;
  xpEarned: number;
  completed: boolean;
  perfectScore: boolean;
}
