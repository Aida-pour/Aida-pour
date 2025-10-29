# 🎓 Penglish - Interactive Farsi Learning Platform

<div align="center">

![Penglish Logo](https://via.placeholder.com/150x150/22c55e/ffffff?text=Penglish)

**Learn Farsi the fun way using Penglish (romanized Persian)**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 🌟 What is Penglish?

Penglish is an interactive Farsi (Persian) learning platform inspired by Duolingo, with a unique twist: **all lessons use Penglish** (Persian written with Latin characters) instead of Farsi script. This allows learners to focus on **pronunciation and meaning first**, before tackling the beautiful but complex Persian alphabet.

### Why Penglish?

- 🗣️ **Focus on Speaking**: Master pronunciation without alphabet complexity
- 🎯 **Faster Progress**: Start conversing in Farsi from day one
- 🧠 **Lower Barrier**: Perfect for beginners intimidated by new scripts
- 🎓 **Proven Method**: Learn like children learn - speaking before writing

---

## ✨ Features

### 🎮 Gamified Learning Experience
- **XP System**: Earn experience points for completing lessons
- **Levels**: Progress through levels as you learn
- **Streaks**: Build daily learning habits
- **Achievements**: Unlock badges for milestones

### 📚 Rich Lesson Content
- **Multiple Exercise Types**:
  - 📝 Multiple Choice
  - ✍️ Fill in the Blank
  - 🔄 Translation
  - 🎧 Listening (coming soon)
  - 🎤 Speaking with AI pronunciation check (coming soon)

- **Progressive Curriculum**:
  - Unit 1: Greetings and Introductions (Salam va Moghademaat)
  - Unit 2: Family Members (Khanevadeh)
  - Unit 3: Numbers (Adad)
  - More units coming soon!

### 🎨 Beautiful Design
- 🌈 Playful, colorful interface inspired by Duolingo
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive (desktop, tablet, mobile)
- ♿ Accessible design principles

### 🤖 AI-Powered Features
- 🎙️ OpenAI Voice Integration
- 🗣️ Text-to-Speech for pronunciation
- 👂 Speech-to-Text for listening exercises
- ✅ AI pronunciation feedback

---

## 🎬 Demo

### Home Page
![Home Page Preview](https://via.placeholder.com/800x500/f0fdf4/22c55e?text=Lesson+Units+Overview)

### Lesson Exercise
![Exercise Preview](https://via.placeholder.com/800x500/fef3c7/f59e0b?text=Interactive+Exercise)

### Completion Celebration
![Completion Preview](https://via.placeholder.com/800x500/dcfce7/16a34a?text=Lesson+Complete!)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn**
- **OpenAI API Key** (for voice features, optional for basic functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aida-pour/Aida-pour.git
   cd Aida-pour/penglish-platform
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In backend directory
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

5. **Initialize the database**
   ```bash
   # In backend directory
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5001
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```

7. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation
- **Vite** - Build tool

#### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database (dev), PostgreSQL (production)
- **JWT** - Authentication
- **Zod** - Validation
- **OpenAI SDK** - Voice features

### Project Structure

```
penglish-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI components
│   │   │   ├── exercises/       # Exercise type components
│   │   │   ├── lessons/         # Lesson components
│   │   │   └── layout/          # Layout components
│   │   ├── pages/               # Page components
│   │   ├── store/               # Zustand state management
│   │   ├── types/               # TypeScript types
│   │   ├── data/                # Lesson content
│   │   ├── utils/               # Utility functions
│   │   └── App.tsx              # Main app component
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/              # API routes
│   │   │   ├── auth.ts          # Authentication
│   │   │   ├── lessons.ts       # Lesson endpoints
│   │   │   ├── progress.ts      # Progress tracking
│   │   │   └── voice.ts         # Voice/AI features
│   │   ├── prisma/
│   │   │   └── schema.prisma    # Database schema
│   │   └── server.ts            # Express server
│   └── package.json
│
└── README.md
```

### Database Schema

```prisma
User {
  id, username, email, password
  level, totalXP, streak
  progress[], achievements[]
}

Lesson {
  id, unit, order
  title (Penglish), titleEnglish
  exercises (JSON), difficulty
}

UserProgress {
  userId, lessonId
  completed, score, xpEarned
}
```

---

## 📖 Usage Guide

### For Learners

1. **Start Learning**: Open the app and browse available lesson units
2. **Choose a Lesson**: Click on any unlocked lesson card
3. **Complete Exercises**: Answer questions to progress through the lesson
4. **Get Feedback**: Immediate feedback on each answer
5. **Earn XP**: Complete lessons to earn experience points and level up
6. **Build Streaks**: Come back daily to maintain your learning streak

### For Content Creators

Want to add more lessons? Edit `frontend/src/data/lessons.ts`:

```typescript
{
  id: 'lesson-4-1',
  unit: 4,
  title: 'Ghaza',
  titleEnglish: 'Food',
  exercises: [
    {
      type: 'multiple_choice',
      question: 'What does "Noon" mean?',
      correctAnswer: 'Bread',
      options: ['Bread', 'Water', 'Rice', 'Tea'],
    },
    // Add more exercises...
  ]
}
```

---

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Core platform architecture
- [x] Basic lesson system
- [x] Multiple choice exercises
- [x] Fill-in-the-blank exercises
- [x] Translation exercises
- [x] XP and leveling system
- [x] Progress tracking

### Phase 2: Enhanced Learning 🚧
- [ ] Listening exercises with audio
- [ ] Speaking exercises with pronunciation check
- [ ] Matching exercises
- [ ] More lesson content (10+ units)
- [ ] Hints and explanations
- [ ] Review system (spaced repetition)

### Phase 3: Social Features 📅
- [ ] User authentication
- [ ] User profiles
- [ ] Leaderboards
- [ ] Friend system
- [ ] Achievements and badges
- [ ] Daily challenges

### Phase 4: Advanced Features 📅
- [ ] Mobile apps (React Native)
- [ ] Offline mode
- [ ] Custom lesson creation
- [ ] Community-contributed content
- [ ] AI conversation practice
- [ ] Farsi script introduction (after Penglish mastery)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **Add Lesson Content**: Create new lessons with Penglish content
2. **Fix Bugs**: Report and fix issues
3. **Add Features**: Implement items from the roadmap
4. **Improve UI/UX**: Make the app more beautiful and user-friendly
5. **Write Documentation**: Help others understand the codebase
6. **Translate**: Add support for other languages

### Development Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR-USERNAME/Aida-pour.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Commit with clear messages
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

### Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Write clear, descriptive variable names
- Add comments for complex logic
- Test your changes before submitting

---

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
GET  /api/auth/me          # Get current user
```

### Lesson Endpoints

```
GET /api/lessons           # Get all lessons
GET /api/lessons/:id       # Get specific lesson
GET /api/lessons/unit/:n   # Get lessons by unit
```

### Progress Endpoints

```
GET  /api/progress                # Get user progress (auth required)
POST /api/progress/update         # Update lesson progress (auth required)
GET  /api/progress/lesson/:id     # Get lesson progress (auth required)
```

### Voice Endpoints

```
POST /api/voice/tts                    # Text-to-speech
POST /api/voice/transcribe             # Speech-to-text
POST /api/voice/check-pronunciation    # Check pronunciation
```

---

## 🔧 Configuration

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5001
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
```

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Heroku)

```bash
cd backend
npm run build
# Deploy to your preferred hosting service
```

### Database

For production, use PostgreSQL:

```env
DATABASE_URL="postgresql://user:pass@host:5432/penglish"
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Duolingo** - Inspiration for gamified learning
- **OpenAI** - Voice and AI capabilities
- **The Farsi Learning Community** - Feedback and support
- **All Contributors** - Thank you for making this project better!

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Aida-pour/Aida-pour/issues)
- **Discussions**: [Join the conversation](https://github.com/Aida-pour/Aida-pour/discussions)
- **Email**: support@penglish.app (if available)

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Made with ❤️ by the Penglish Team**

[⬆ Back to Top](#-penglish---interactive-farsi-learning-platform)

</div>
