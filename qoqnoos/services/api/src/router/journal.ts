import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '../db';

export const journalRouter = router({
  create: protectedProcedure.input(z.object({ title: z.string().optional(), content: z.string().min(1), mood: z.number().min(1).max(10).optional(), tags: z.array(z.string()).default([]) })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    return prisma.journalEntry.create({ data: { userId: user.id, ...input } });
  }),
  list: protectedProcedure.input(z.object({ limit: z.number().default(20), cursor: z.string().optional() })).query(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    const entries = await prisma.journalEntry.findMany({ where: { userId: user.id }, take: input.limit + 1, cursor: input.cursor ? { id: input.cursor } : undefined, orderBy: { createdAt: 'desc' } });
    let nextCursor: string | undefined;
    if (entries.length > input.limit) { nextCursor = entries.pop()?.id; }
    return { entries, nextCursor };
  }),
  logMood: protectedProcedure.input(z.object({ mood: z.number().min(1).max(10), energy: z.number().min(1).max(10), anxiety: z.number().min(1).max(10), notes: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    return prisma.moodLog.create({ data: { userId: user.id, ...input } });
  }),
  getMoodHistory: protectedProcedure.input(z.object({ days: z.number().default(30) })).query(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    const since = new Date(); since.setDate(since.getDate() - input.days);
    return prisma.moodLog.findMany({ where: { userId: user.id, createdAt: { gte: since } }, orderBy: { createdAt: 'asc' } });
  }),
});
