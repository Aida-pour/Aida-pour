import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { prisma } from '../db';

export const contentRouter = router({
  list: publicProcedure.input(z.object({ type: z.string().optional(), language: z.enum(['EN','FA']).optional(), limit: z.number().default(20), cursor: z.string().optional() })).query(async ({ input }) => {
    const items = await prisma.contentItem.findMany({ where: { isPublished: true, type: input.type as any, language: input.language as any }, take: input.limit + 1, cursor: input.cursor ? { id: input.cursor } : undefined, orderBy: { publishedAt: 'desc' } });
    let nextCursor: string | undefined;
    if (items.length > input.limit) { nextCursor = items.pop()?.id; }
    return { items, nextCursor };
  }),
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const item = await prisma.contentItem.findUniqueOrThrow({ where: { slug: input.slug } });
    await prisma.contentItem.update({ where: { id: item.id }, data: { viewCount: { increment: 1 } } });
    return item;
  }),
  bookmark: protectedProcedure.input(z.object({ contentId: z.string() })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    return prisma.bookmark.create({ data: { userId: user.id, contentId: input.contentId } });
  }),
});
