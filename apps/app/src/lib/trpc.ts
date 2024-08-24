import { PUBLIC_SERVER_URL } from '$env/static/public';
import { trpc as t, trpcWithSession as tSession } from '@kader/shared/trpc';

export const trpcWithSession = (sessionId: string) => tSession(PUBLIC_SERVER_URL, sessionId);

export const trpc = t(PUBLIC_SERVER_URL);
