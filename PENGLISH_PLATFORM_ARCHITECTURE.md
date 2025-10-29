# Penglish Learning Platform - Architecture

## Overview
An interactive Farsi learning platform inspired by Duolingo, using Penglish (romanized Persian) to help learners focus on pronunciation and meaning before learning the alphabet.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Framer Motion for animations
- **State Management**: Zustand (lightweight, simple)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Audio**: Web Audio API + MediaRecorder
- **Icons**: Lucide React (clean, modern icons)

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: SQLite (easy setup) → migrate to PostgreSQL later
- **ORM**: Prisma (type-safe, modern)
- **Authentication**: JWT with bcrypt
- **Validation**: Zod (TypeScript-first validation)
- **Voice Integration**: Existing OpenAI APIs

### DevOps
- **Build Tool**: Vite (fast development)
- **Package Manager**: npm
- **Version Control**: Git
- **Deployment**: Docker-ready

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Lessons    │  │ Exercises    │  │   Profile    │      │
│  │   Component  │  │  Component   │  │  Component   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│  ┌──────▼──────────────────▼──────────────────▼───────┐     │
│  │         Zustand State Management                   │     │
│  └──────┬──────────────────────────────────────────────┘    │
│         │                                                    │
└─────────┼────────────────────────────────────────────────────┘
          │ API Calls (Axios)
          │
┌─────────▼────────────────────────────────────────────────────┐
│              BACKEND API (Express + TypeScript)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Auth Routes  │  │Lesson Routes │  │Progress Routes│       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │               │
│  ┌──────▼──────────────────▼──────────────────▼────────┐     │
│  │           Prisma ORM (Database Access)             │     │
│  └──────┬─────────────────────────────────────────────┘     │
│         │                                                    │
│  ┌──────▼─────────┐     ┌─────────────────┐                 │
│  │  SQLite DB     │     │  OpenAI Voice   │                 │
│  │  (Users,       │     │  Integration    │                 │
│  │   Lessons,     │     │  (Pronunciation)│                 │
│  │   Progress)    │     └─────────────────┘                 │
│  └────────────────┘                                          │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema

### Users
```typescript
{
  id: string (UUID)
  username: string (unique)
  email: string (unique)
  password: string (hashed)
  displayName: string
  level: number
  totalXP: number
  streak: number
  lastActiveDate: date
  createdAt: date
}
```

### Lessons
```typescript
{
  id: string (UUID)
  unit: number
  order: number
  title: string (Penglish)
  titleEnglish: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  xpReward: number
  content: JSON // Lesson data
}
```

### Exercises
```typescript
{
  id: string (UUID)
  lessonId: string (FK)
  type: "multiple_choice" | "fill_blank" | "listening" | "speaking" | "matching"
  order: number
  question: string (Penglish)
  questionEnglish: string
  correctAnswer: string
  options: string[] (for multiple choice)
  audioUrl: string (optional, for listening)
  hints: string[]
}
```

### UserProgress
```typescript
{
  id: string (UUID)
  userId: string (FK)
  lessonId: string (FK)
  completed: boolean
  score: number (0-100)
  attempts: number
  lastAttemptDate: date
  xpEarned: number
}
```

### Achievements
```typescript
{
  id: string (UUID)
  name: string
  description: string
  icon: string
  requirement: JSON
  xpReward: number
}
```

## Core Features

### 1. Lesson System
- **Units**: Grouped by theme (greetings, family, food, etc.)
- **Progressive Difficulty**: Beginner → Intermediate → Advanced
- **Unlocking Mechanism**: Complete lessons to unlock next

### 2. Exercise Types
- **Multiple Choice**: Select correct Penglish word/phrase
- **Fill in the Blank**: Complete sentence with missing word
- **Listening**: Hear Farsi pronunciation, type in Penglish
- **Speaking**: Speak Penglish phrase, AI checks pronunciation
- **Matching**: Match Penglish words to English translations

### 3. Gamification
- **XP System**: Earn points for completing lessons
- **Levels**: Level up every 1000 XP
- **Streaks**: Track consecutive days of learning
- **Achievements**: Special badges for milestones
- **Leaderboards**: Compare progress with friends (future)

### 4. Learning Content (Penglish Examples)

**Unit 1: Greetings**
- Salam (Hello)
- Chetori? (How are you?)
- Khobam, mersi (I'm good, thanks)
- Khoda hafez (Goodbye)

**Unit 2: Family**
- Pedar (Father)
- Madar (Mother)
- Baradar (Brother)
- Khahar (Sister)

**Unit 3: Numbers**
- Yek (One)
- Do (Two)
- Se (Three)

### 5. UI/UX Design Principles
- **Playful**: Bright colors, friendly animations
- **Clean**: Minimal distractions, focus on content
- **Simple**: Intuitive navigation, clear instructions
- **Responsive**: Mobile-first design
- **Accessible**: High contrast, keyboard navigation

## Project Structure

```
/penglish-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── lessons/
│   │   │   ├── exercises/
│   │   │   ├── profile/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── lessons.ts
│   │   │   ├── progress.ts
│   │   │   └── voice.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── types/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   └── types/
│
└── README.md
```

## Development Phases

### Phase 1: Foundation (Current)
- Set up project structure
- Create database schema
- Build basic UI components
- Implement authentication

### Phase 2: Core Learning (Next)
- Create lesson content
- Build exercise components
- Implement progress tracking
- Add XP system

### Phase 3: Gamification
- Streaks and achievements
- Level progression
- Animations and feedback

### Phase 4: Voice Integration
- Speaking exercises
- Pronunciation feedback
- Audio playback for listening

### Phase 5: Polish
- Mobile responsiveness
- Performance optimization
- User testing
- Content expansion

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/lessons/unit/:unit` - Get lessons by unit

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress/complete` - Mark lesson complete
- `PUT /api/progress/score` - Update lesson score

### Voice
- `POST /api/voice/transcribe` - Transcribe speech
- `POST /api/voice/tts` - Text-to-speech
- `POST /api/voice/check-pronunciation` - Check pronunciation

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/achievements` - Get achievements

## Next Steps

1. Initialize frontend React + TypeScript project with Vite
2. Initialize backend Express + TypeScript project
3. Set up Prisma with SQLite
4. Create basic authentication flow
5. Build first lesson component
6. Create sample Penglish lesson content
7. Implement XP and progress tracking
8. Design and implement UI theme
