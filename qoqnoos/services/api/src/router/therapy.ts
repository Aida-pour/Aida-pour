import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '../db';

export const therapyRouter = router({
  listTherapists: protectedProcedure.input(z.object({ specialty: z.string().optional(), language: z.enum(['EN','FA']).optional() })).query(async ({ input }) => prisma.therapist.findMany({ where: { isActive: true, isVerified: true, specialties: input.specialty ? { has: input.specialty } : undefined } })),
  bookSession: protectedProcedure.input(z.object({ therapistId: z.string(), scheduledAt: z.string().datetime(), durationMinutes: z.number().default(50) })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId }, include: { subscription: true } });
    if (!user.subscription || !['CLINICAL','RETREAT'].includes(user.subscription.tier)) throw new Error('Clinical or Retreat subscription required');
    const therapist = await prisma.therapist.findUniqueOrThrow({ where: { id: input.therapistId } });
    return prisma.therapySession.create({ data: { userId: user.id, therapistId: input.therapistId, scheduledAt: new Date(input.scheduledAt), durationMinutes: input.durationMinutes, dailyRoomUrl: therapist.dailyRoomUrl || '', status: 'SCHEDULED' } });
  }),
  listMySessions: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    return prisma.therapySession.findMany({ where: { userId: user.id }, include: { therapist: true }, orderBy: { scheduledAt: 'desc' } });
  }),
  cancelSession: protectedProcedure.input(z.object({ sessionId: z.string() })).mutation(async ({ input }) => prisma.therapySession.update({ where: { id: input.sessionId }, data: { status: 'CANCELED' } })),
});
