import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        lesson: true,
      },
    });

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Complete lesson / Update progress
const updateProgressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean().optional(),
  score: z.number().min(0).max(100),
  xpEarned: z.number().min(0),
});

router.post('/update', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const body = updateProgressSchema.parse(req.body);

    // Check if progress exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: body.lessonId,
        },
      },
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      progress = await prisma.userProgress.update({
        where: {
          userId_lessonId: {
            userId,
            lessonId: body.lessonId,
          },
        },
        data: {
          completed: body.completed ?? existingProgress.completed,
          score: Math.max(body.score, existingProgress.score), // Keep best score
          attempts: existingProgress.attempts + 1,
          lastAttemptDate: new Date(),
          xpEarned: Math.max(body.xpEarned, existingProgress.xpEarned),
        },
      });
    } else {
      // Create new progress
      progress = await prisma.userProgress.create({
        data: {
          userId,
          lessonId: body.lessonId,
          completed: body.completed ?? false,
          score: body.score,
          attempts: 1,
          lastAttemptDate: new Date(),
          xpEarned: body.xpEarned,
        },
      });
    }

    // Update user XP if this is a new completion or better score
    if (!existingProgress || body.xpEarned > existingProgress.xpEarned) {
      const xpDiff = existingProgress
        ? body.xpEarned - existingProgress.xpEarned
        : body.xpEarned;

      await prisma.user.update({
        where: { id: userId },
        data: {
          totalXP: { increment: xpDiff },
          level: { set: Math.floor((await prisma.user.findUnique({ where: { id: userId } }))!.totalXP / 1000) + 1 },
        },
      });
    }

    res.json({ progress });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get lesson progress
router.get('/lesson/:lessonId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { lessonId } = req.params;

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      include: {
        lesson: true,
      },
    });

    res.json({ progress });
  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson progress' });
  }
});

export default router;
