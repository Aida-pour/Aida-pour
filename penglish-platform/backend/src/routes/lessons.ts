import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: [{ unit: 'asc' }, { order: 'asc' }],
    });

    // Parse JSON content
    const parsedLessons = lessons.map((lesson) => ({
      ...lesson,
      content: JSON.parse(lesson.content),
    }));

    res.json({ lessons: parsedLessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Get lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({
      lesson: {
        ...lesson,
        content: JSON.parse(lesson.content),
      },
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Get lessons by unit
router.get('/unit/:unit', async (req, res) => {
  try {
    const unit = parseInt(req.params.unit);

    if (isNaN(unit)) {
      return res.status(400).json({ error: 'Invalid unit number' });
    }

    const lessons = await prisma.lesson.findMany({
      where: { unit },
      orderBy: { order: 'asc' },
    });

    const parsedLessons = lessons.map((lesson) => ({
      ...lesson,
      content: JSON.parse(lesson.content),
    }));

    res.json({ lessons: parsedLessons });
  } catch (error) {
    console.error('Get unit lessons error:', error);
    res.status(500).json({ error: 'Failed to fetch unit lessons' });
  }
});

export default router;
