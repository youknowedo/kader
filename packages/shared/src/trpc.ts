import type { AppRouter } from "@kader/server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const trpcWithSession = (serverUrl: string, sessionId: string) =>
    createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url: `${serverUrl}/trpc`,
                fetch: (url, options) =>
                    fetch(url, {
                        ...options,
                        credentials: "include",
                        headers: {
                            ...options?.headers,
                            cookie: `auth_session=${sessionId}`,
                        },
                    }),
            }),
        ],
    });

export const trpc = (serverUrl: string) =>
    createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url: `${serverUrl}/trpc`,
                fetch: (url, options) =>
                    fetch(url, {
                        ...options,
                        credentials: "include",
                        headers: {
                            ...options?.headers,
                        },
                    }),
            }),
        ],
    });
