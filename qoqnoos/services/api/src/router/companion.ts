import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '../db';

export const companionRouter = router({
  createSession: protectedProcedure
    .input(z.object({ sessionType: z.enum(['TEXT','VOICE','VIDEO']).default('TEXT'), language: z.enum(['EN','FA']).default('EN') }))
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
      return prisma.companionSession.create({ data: { userId: user.id, ...input } });
    }),
  getSession: protectedProcedure.input(z.object({ sessionId: z.string() })).query(async ({ input }) => prisma.companionSession.findUniqueOrThrow({ where: { id: input.sessionId }, include: { messages: { orderBy: { createdAt: 'asc' } } } })),
  listSessions: protectedProcedure.input(z.object({ limit: z.number().default(20), cursor: z.string().optional() })).query(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    const sessions = await prisma.companionSession.findMany({ where: { userId: user.id }, take: input.limit + 1, cursor: input.cursor ? { id: input.cursor } : undefined, orderBy: { createdAt: 'desc' } });
    let nextCursor: string | undefined;
    if (sessions.length > input.limit) { nextCursor = sessions.pop()?.id; }
    return { sessions, nextCursor };
  }),
  endSession: protectedProcedure.input(z.object({ sessionId: z.string() })).mutation(async ({ input }) => prisma.companionSession.update({ where: { id: input.sessionId }, data: { endedAt: new Date() } })),
});
