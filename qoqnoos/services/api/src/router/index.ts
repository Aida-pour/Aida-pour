import { router } from '../trpc';
import { authRouter } from './auth';
import { userRouter } from './user';
import { companionRouter } from './companion';
import { subscriptionRouter } from './subscription';
import { contentRouter } from './content';
import { journalRouter } from './journal';
import { therapyRouter } from './therapy';
import { marketingRouter } from './marketing';
import { supportRouter } from './support';

export const appRouter = router({ auth: authRouter, user: userRouter, companion: companionRouter, subscription: subscriptionRouter, content: contentRouter, journal: journalRouter, therapy: therapyRouter, marketing: marketingRouter, support: supportRouter });
export type AppRouter = typeof appRouter;
