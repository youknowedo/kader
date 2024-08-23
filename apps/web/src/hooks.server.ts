import { trpcWithSession } from '@kader/shared/trpc';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('auth_session');
	if (!sessionId) {
		event.locals.user = undefined;
		event.locals.sessionId = undefined;
		return resolve(event);
	}

	const { success, error } = await trpcWithSession(sessionId).session.validate.query();
	if (!success) {
		event.locals.user = undefined;
		event.locals.sessionId = undefined;

		console.log('Unauthenticated');
		console.log(error);
		return resolve(event);
	}

	const { user } = await trpcWithSession(sessionId).user.getSingle.query();

	event.locals.user = user;
	event.locals.sessionId = sessionId;
	return resolve(event);
};

declare module 'lucia' {
	interface User {
		hex_qr_id: string | null;
		email: string;
		username: string;
		completed_profile: boolean;
		full_name: string | null;
		role: 'admin' | 'vendor' | 'member' | 'user';
		vendor_id: string | null;
		pfp: string | null;
	}
}
