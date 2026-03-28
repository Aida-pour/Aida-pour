import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../db';

export const marketingRouter = router({
  getAds: publicProcedure.input(z.object({ placement: z.string(), userTier: z.enum(['FREE','PREMIUM','CLINICAL','RETREAT']).optional() })).query(async ({ input }) => {
    const ads = await prisma.adPlacement.findMany({ where: { isActive: true, placement: input.placement }, take: 2, orderBy: { createdAt: 'desc' } });
    if (ads.length > 0) await prisma.adPlacement.updateMany({ where: { id: { in: ads.map(a => a.id) } }, data: { impressions: { increment: 1 } } });
    return ads;
  }),
  trackClick: publicProcedure.input(z.object({ adId: z.string() })).mutation(async ({ input }) => { await prisma.adPlacement.update({ where: { id: input.adId }, data: { clicks: { increment: 1 } } }); }),
  getBooks: publicProcedure.query(async () => [
    { title: 'In the Realm of Hungry Ghosts', author: 'Gabor Mate', category: 'trauma' },
    { title: 'Mating in Captivity', author: 'Esther Perel', category: 'relationships' },
    { title: 'The Rumi Prescription', author: 'Melody Moezzi', category: 'persian_wisdom' },
  ]),
});
