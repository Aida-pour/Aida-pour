import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './router';
import { createContext } from './trpc';

const server = Fastify({ maxParamLength: 5000, logger: true });
server.register(fastifyTRPCPlugin, { prefix: '/trpc', trpcOptions: { router: appRouter, createContext } });
server.get('/health', async () => ({ status: 'healthy', service: 'qoqnoos-api' }));

const start = async () => {
  const port = parseInt(process.env.PORT || '3000', 10);
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`Qoqnoos API running on port ${port}`);
};
start();
