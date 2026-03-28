import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import OpenAI from 'openai';

const openai = new OpenAI();
const SUPPORT_PROMPT = 'You are Pari, support AI for Qoqnoos. Handle billing, tech issues, content questions. Tiers: Free/$0, Premium/$19.99, Clinical/$49.99, Retreat/$199.99. Be empathetic. Crisis: provide 988 Lifeline.';

export const supportRouter = router({
  chat: publicProcedure.input(z.object({ message: z.string(), history: z.array(z.object({ role: z.enum(['user','assistant']), content: z.string() })).default([]), language: z.enum(['EN','FA']).default('EN') })).mutation(async ({ input }) => {
    const response = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: SUPPORT_PROMPT }, ...input.history, { role: 'user', content: input.message }], max_tokens: 500 });
    const content = response.choices[0].message.content!;
    const distressKeywords = ['crisis','emergency','harm','suicide','self-harm'];
    const hasDistress = distressKeywords.some(k => input.message.toLowerCase().includes(k));
    return { content, needsHuman: content.toLowerCase().includes('escalate'), hasDistress, crisisResources: hasDistress ? { us: '988 Lifeline', iran: 'Behzisti: 1480' } : null };
  }),
});
