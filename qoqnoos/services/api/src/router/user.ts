import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '../db';

export const userRouter = router({
  updateProfile: protectedProcedure
    .input(z.object({ displayName: z.string().optional(), bio: z.string().optional(), language: z.enum(['EN','FA']).optional(), prefersDarkMode: z.boolean().optional(), timezone: z.string().optional(), persianHeritage: z.boolean().optional(), diasporaLocation: z.string().optional() }))
    .mutation(async ({ ctx, input }) => prisma.user.update({ where: { firebaseUid: ctx.userId }, data: { ...input, isRTL: input.language === 'FA' ? true : undefined } })),
  updateWellnessProfile: protectedProcedure
    .input(z.object({ primaryGoals: z.array(z.string()).optional(), therapyHistory: z.boolean().optional(), meditationExperience: z.enum(['BEGINNER','INTERMEDIATE','ADVANCED']).optional() }))
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
      return prisma.wellnessProfile.upsert({ where: { userId: user.id }, create: { userId: user.id, ...input } as any, update: input as any });
    }),
  delete: protectedProcedure.mutation(async ({ ctx }) => prisma.user.update({ where: { firebaseUid: ctx.userId }, data: { deletedAt: new Date() } })),
});
