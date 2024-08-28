import { trpc as t, trpcWithSession as tSession } from '@kader/shared/trpc';

export const trpcWithSession = (sessionId: string) => tSession('/api', sessionId);

export const trpc = t('/api');
