import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function handleWebhook(payload: Buffer, signature: string) {
  const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, tier } = session.metadata!;
      await prisma.subscription.upsert({ where: { userId }, create: { userId, tier: tier as any, status: 'ACTIVE', stripeSubscriptionId: session.subscription as string }, update: { tier: tier as any, status: 'ACTIVE', stripeSubscriptionId: session.subscription as string } });
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({ where: { userId: sub.metadata.userId }, data: { status: sub.status.toUpperCase() as any, currentPeriodStart: new Date(sub.current_period_start * 1000), currentPeriodEnd: new Date(sub.current_period_end * 1000), cancelAtPeriodEnd: sub.cancel_at_period_end } });
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({ where: { userId: sub.metadata.userId }, data: { status: 'CANCELED', tier: 'FREE' } });
      break;
    }
  }
}
