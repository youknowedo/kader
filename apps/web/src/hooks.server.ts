import { trpcWithSession } from '$lib/trpc';
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
