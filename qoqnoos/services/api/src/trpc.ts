import { initTRPC, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { verifyFirebaseToken } from './auth/firebase';

export async function createContext({ req }: CreateFastifyContextOptions) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let userId: string | null = null;
  if (token) { try { userId = (await verifyFirebaseToken(token)).uid; } catch {} }
  return { userId };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});
export const protectedProcedure = t.procedure.use(isAuthed);
