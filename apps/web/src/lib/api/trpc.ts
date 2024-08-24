import type { RequestEvent } from '@sveltejs/kit';
import { initTRPC } from '@trpc/server';
import { auth } from './procedures/auth';
import { qr } from './procedures/qr';
import { session } from './procedures/session';
import { user } from './procedures/user';
import { vendor } from './procedures/vendor';

export const createContext = (e: RequestEvent) => {
	return { req: e.request, sessionId: e.cookies.get('auth_session') };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;

export const appRouter = router({
	auth,
	qr,
	session,
	user,
	vendor
});
