import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import Stripe from 'stripe';
import { prisma } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PRICE_IDS: Record<string, string> = { PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!, PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!, CLINICAL_MONTHLY: process.env.STRIPE_CLINICAL_MONTHLY_PRICE_ID!, CLINICAL_YEARLY: process.env.STRIPE_CLINICAL_YEARLY_PRICE_ID!, RETREAT_MONTHLY: process.env.STRIPE_RETREAT_MONTHLY_PRICE_ID! };

export const subscriptionRouter = router({
  createCheckoutSession: protectedProcedure.input(z.object({ tier: z.enum(['PREMIUM','CLINICAL','RETREAT']), interval: z.enum(['monthly','yearly']).default('monthly'), successUrl: z.string().url(), cancelUrl: z.string().url() })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    let customerId = user.stripeCustomerId;
    if (!customerId) { const c = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } }); customerId = c.id; await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } }); }
    const session = await stripe.checkout.sessions.create({ customer: customerId, mode: 'subscription', line_items: [{ price: PRICE_IDS[`${input.tier}_${input.interval.toUpperCase()}`], quantity: 1 }], success_url: input.successUrl, cancel_url: input.cancelUrl, allow_promotion_codes: true, subscription_data: { trial_period_days: 7, metadata: { userId: user.id, tier: input.tier } } });
    return { sessionId: session.id, url: session.url };
  }),
  createPortalSession: protectedProcedure.input(z.object({ returnUrl: z.string().url() })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } });
    if (!user.stripeCustomerId) throw new Error('No subscription');
    const session = await stripe.billingPortal.sessions.create({ customer: user.stripeCustomerId, return_url: input.returnUrl });
    return { url: session.url };
  }),
  getCurrent: protectedProcedure.query(async ({ ctx }) => { const user = await prisma.user.findFirstOrThrow({ where: { firebaseUid: ctx.userId } }); return prisma.subscription.findUnique({ where: { userId: user.id } }); }),
});
