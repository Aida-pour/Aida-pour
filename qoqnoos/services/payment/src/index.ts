import Fastify from 'fastify';
import { handleWebhook } from './webhook';

const server = Fastify({ logger: true });
server.post('/webhook', { config: { rawBody: true } }, async (request, reply) => {
  const signature = request.headers['stripe-signature'] as string;
  try { await handleWebhook(request.rawBody as Buffer, signature); return reply.send({ received: true }); }
  catch (err) { server.log.error(err); return reply.status(400).send({ error: 'Webhook handler failed' }); }
});
server.get('/health', async () => ({ status: 'healthy', service: 'qoqnoos-payment' }));
const start = async () => { const port = parseInt(process.env.PORT || '3003', 10); await server.listen({ port, host: '0.0.0.0' }); };
start();
