import type { AppRouter } from '@kader/server';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const trpcWithSession = (sessionId: string) =>
	createTRPCProxyClient<AppRouter>({
		links: [
			httpBatchLink({
				url: 'http://localhost:3000/trpc',
				fetch: (url, options) =>
					fetch(url, {
						...options,
						credentials: 'include',
						headers: {
							...options?.headers,
							cookie: `auth_session=${sessionId}`
						}
					})
			})
		]
	});

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'http://localhost:3000/trpc',
			fetch: (url, options) =>
				fetch(url, {
					...options,
					credentials: 'include',
					headers: {
						...options?.headers
					}
				})
		})
	]
});
