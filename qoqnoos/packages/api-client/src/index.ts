import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@qoqnoos/api/src/router';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient(url: string, getToken: () => Promise<string | null>) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url,
        async headers() {
          const token = await getToken();
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}
