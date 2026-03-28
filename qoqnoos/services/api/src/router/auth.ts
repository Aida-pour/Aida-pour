import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { prisma } from '../db';

export const authRouter = router({
  register: publicProcedure.input(z.object({ firebaseUid: z.string(), email: z.string().email(), displayName: z.string().optional(), language: z.enum(['EN','FA']).default('EN'), persianHeritage: z.boolean().default(false) })).mutation(async ({ input }) => {
    return prisma.user.create({ data: { ...input, isRTL: input.language === 'FA', subscription: { create: { tier: 'FREE', status: 'ACTIVE' } } }, include: { subscription: true } });
  }),
  me: protectedProcedure.query(async ({ ctx }) => prisma.user.findFirst({ where: { firebaseUid: ctx.userId }, include: { subscription: true, wellnessProfile: true } })),
});
