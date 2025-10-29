import { Lesson, LessonUnit } from '@/types';

// Sample lesson data in Penglish
export const lessonUnits: LessonUnit[] = [
  {
    unit: 1,
    title: 'Salam va Moghademaat',
    titleEnglish: 'Greetings and Introductions',
    description: 'Learn basic Farsi greetings and how to introduce yourself',
    icon: '👋',
    lessons: [
      {
        id: 'lesson-1-1',
        unit: 1,
        order: 1,
        title: 'Salam!',
        titleEnglish: 'Hello!',
        description: 'Learn to greet people in Farsi',
        difficulty: 'beginner',
        xpReward: 50,
        locked: false,
        exercises: [
          {
            id: 'ex-1-1-1',
            type: 'multiple_choice',
            order: 1,
            question: 'How do you say "Hello" in Farsi?',
            correctAnswer: 'Salam',
            options: ['Salam', 'Mersi', 'Khoda hafez', 'Befarmayid'],
            hints: ['This is the most common greeting in Farsi'],
          },
          {
            id: 'ex-1-1-2',
            type: 'multiple_choice',
            order: 2,
            question: 'What does "Chetori?" mean?',
            correctAnswer: 'How are you?',
            options: ['Hello', 'How are you?', 'Thank you', 'Goodbye'],
            hints: ['This is how you ask about someone\'s wellbeing'],
          },
          {
            id: 'ex-1-1-3',
            type: 'translate',
            order: 3,
            question: 'Translate to Penglish: "I am good, thank you"',
            correctAnswer: 'Khobam, mersi',
            hints: ['Khobam means "I am good"'],
          },
          {
            id: 'ex-1-1-4',
            type: 'fill_blank',
            order: 4,
            question: 'Fill in the blank: "_____ hafez" (Goodbye)',
            correctAnswer: 'Khoda',
            hints: ['This word means "God" in Farsi'],
          },
        ],
      },
      {
        id: 'lesson-1-2',
        unit: 1,
        order: 2,
        title: 'Esme man...',
        titleEnglish: 'My name is...',
        description: 'Learn to introduce yourself',
        difficulty: 'beginner',
        xpReward: 50,
        locked: true,
        exercises: [
          {
            id: 'ex-1-2-1',
            type: 'multiple_choice',
            order: 1,
            question: 'How do you say "My name is..." in Farsi?',
            correctAnswer: 'Esme man...',
            options: ['Esme man...', 'Man hasti...', 'To hasti...', 'Ma hastim...'],
            hints: ['Esm means "name"'],
          },
          {
            id: 'ex-1-2-2',
            type: 'translate',
            order: 2,
            question: 'Translate: "What is your name?"',
            correctAnswer: 'Esme shoma chie?',
            hints: ['Shoma means "you"'],
          },
          {
            id: 'ex-1-2-3',
            type: 'fill_blank',
            order: 3,
            question: 'Fill in: "Man _____ hastam" (I am a student)',
            correctAnswer: 'daneshjo',
            hints: ['This word means "student"'],
          },
        ],
      },
    ],
  },
  {
    unit: 2,
    title: 'Khanevadeh',
    titleEnglish: 'Family',
    description: 'Learn family member names in Farsi',
    icon: '👨‍👩‍👧‍👦',
    lessons: [
      {
        id: 'lesson-2-1',
        unit: 2,
        order: 1,
        title: 'Pedar va Madar',
        titleEnglish: 'Father and Mother',
        description: 'Learn to talk about parents',
        difficulty: 'beginner',
        xpReward: 75,
        locked: true,
        exercises: [
          {
            id: 'ex-2-1-1',
            type: 'multiple_choice',
            order: 1,
            question: 'What does "Pedar" mean?',
            correctAnswer: 'Father',
            options: ['Father', 'Mother', 'Brother', 'Sister'],
          },
          {
            id: 'ex-2-1-2',
            type: 'multiple_choice',
            order: 2,
            question: 'How do you say "Mother" in Farsi?',
            correctAnswer: 'Madar',
            options: ['Madar', 'Pedar', 'Khahar', 'Baradar'],
          },
          {
            id: 'ex-2-1-3',
            type: 'matching',
            order: 3,
            question: 'Match the Penglish words with English',
            correctAnswer: 'Pedar=Father,Madar=Mother',
            options: ['Pedar', 'Madar', 'Father', 'Mother'],
          },
        ],
      },
      {
        id: 'lesson-2-2',
        unit: 2,
        order: 2,
        title: 'Baradar va Khahar',
        titleEnglish: 'Brother and Sister',
        description: 'Learn to talk about siblings',
        difficulty: 'beginner',
        xpReward: 75,
        locked: true,
        exercises: [
          {
            id: 'ex-2-2-1',
            type: 'multiple_choice',
            order: 1,
            question: 'What does "Baradar" mean?',
            correctAnswer: 'Brother',
            options: ['Brother', 'Sister', 'Father', 'Mother'],
          },
          {
            id: 'ex-2-2-2',
            type: 'translate',
            order: 2,
            question: 'Translate: "I have two sisters"',
            correctAnswer: 'Man do ta khahar daram',
            hints: ['Do means "two", ta is a counter'],
          },
        ],
      },
    ],
  },
  {
    unit: 3,
    title: 'Adad',
    titleEnglish: 'Numbers',
    description: 'Learn to count in Farsi',
    icon: '🔢',
    lessons: [
      {
        id: 'lesson-3-1',
        unit: 3,
        order: 1,
        title: 'Adad 1-10',
        titleEnglish: 'Numbers 1-10',
        description: 'Learn numbers from one to ten',
        difficulty: 'beginner',
        xpReward: 100,
        locked: true,
        exercises: [
          {
            id: 'ex-3-1-1',
            type: 'multiple_choice',
            order: 1,
            question: 'What is "yek" in English?',
            correctAnswer: 'One',
            options: ['One', 'Two', 'Three', 'Ten'],
          },
          {
            id: 'ex-3-1-2',
            type: 'fill_blank',
            order: 2,
            question: 'Fill in: yek, do, ___, chahar (one, two, ___, four)',
            correctAnswer: 'se',
          },
          {
            id: 'ex-3-1-3',
            type: 'translate',
            order: 3,
            question: 'How do you say "five" in Penglish?',
            correctAnswer: 'panj',
          },
        ],
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  for (const unit of lessonUnits) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getNextLesson(currentLessonId: string): Lesson | undefined {
  for (const unit of lessonUnits) {
    const currentIndex = unit.lessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex !== -1) {
      // Check if there's a next lesson in the same unit
      if (currentIndex < unit.lessons.length - 1) {
        return unit.lessons[currentIndex + 1];
      }
      // Check if there's a next unit
      const nextUnit = lessonUnits.find((u) => u.unit === unit.unit + 1);
      if (nextUnit && nextUnit.lessons.length > 0) {
        return nextUnit.lessons[0];
      }
    }
  }
  return undefined;
}
