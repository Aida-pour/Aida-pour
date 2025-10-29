import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '@/store';
import HomePage from '@/pages/HomePage';
import LessonPage from '@/pages/LessonPage';

function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    // For demo purposes, set a mock user
    // In production, this would check authentication and fetch user data
    setUser({
      id: 'demo-user-1',
      username: 'learner',
      email: 'learner@penglish.app',
      displayName: 'Language Learner',
      level: 1,
      totalXP: 0,
      streak: 0,
      lastActiveDate: new Date(),
      createdAt: new Date(),
    });
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
