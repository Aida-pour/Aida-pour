import { create } from 'zustand';
import { User, Lesson, UserProgress, Achievement } from '@/types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Lessons state
  lessons: Lesson[];
  currentLesson: Lesson | null;
  setLessons: (lessons: Lesson[]) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;

  // Progress state
  progress: Record<string, UserProgress>;
  setProgress: (progress: Record<string, UserProgress>) => void;
  updateLessonProgress: (lessonId: string, progressData: Partial<UserProgress>) => void;

  // Achievements state
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (achievement: Achievement) => void;

  // UI state
  showAchievementModal: boolean;
  recentAchievement: Achievement | null;
  setShowAchievementModal: (show: boolean) => void;
  setRecentAchievement: (achievement: Achievement | null) => void;

  // XP and level tracking
  addXP: (amount: number) => void;
  updateStreak: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial user state
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false, progress: {}, unlockedAchievements: [] }),

  // Initial lessons state
  lessons: [],
  currentLesson: null,
  setLessons: (lessons) => set({ lessons }),
  setCurrentLesson: (currentLesson) => set({ currentLesson }),

  // Initial progress state
  progress: {},
  setProgress: (progress) => set({ progress }),
  updateLessonProgress: (lessonId, progressData) =>
    set((state) => ({
      progress: {
        ...state.progress,
        [lessonId]: {
          ...state.progress[lessonId],
          ...progressData,
        } as UserProgress,
      },
    })),

  // Initial achievements state
  achievements: [],
  unlockedAchievements: [],
  setAchievements: (achievements) => set({ achievements }),
  unlockAchievement: (achievement) =>
    set((state) => ({
      unlockedAchievements: [...state.unlockedAchievements, achievement],
      recentAchievement: achievement,
      showAchievementModal: true,
    })),

  // Initial UI state
  showAchievementModal: false,
  recentAchievement: null,
  setShowAchievementModal: (showAchievementModal) => set({ showAchievementModal }),
  setRecentAchievement: (recentAchievement) => set({ recentAchievement }),

  // XP and level tracking
  addXP: (amount) =>
    set((state) => {
      if (!state.user) return state;

      const newTotalXP = state.user.totalXP + amount;
      const newLevel = Math.floor(newTotalXP / 1000) + 1;

      return {
        user: {
          ...state.user,
          totalXP: newTotalXP,
          level: newLevel,
        },
      };
    }),

  updateStreak: () =>
    set((state) => {
      if (!state.user) return state;

      const today = new Date();
      const lastActive = new Date(state.user.lastActiveDate);
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = state.user.streak;

      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If daysDiff === 0, same day, keep streak

      return {
        user: {
          ...state.user,
          streak: newStreak,
          lastActiveDate: today,
        },
      };
    }),
}));
