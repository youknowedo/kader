import { PUBLIC_SERVER_URL } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { type Session, type User } from 'lucia';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('auth_session');
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const data = new URLSearchParams();
	data.append('session_id', sessionId);
	const validateResponse = await fetch(PUBLIC_SERVER_URL + '/auth/validate/session', {
		method: 'POST',
		body: data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		}
	});
	const { session, user }: { user: User; session: Session } = await validateResponse.json();

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

declare module 'lucia' {
	interface User {
		hex_qr_id: string;
		email: string;
		username: string;
		github_id: number;
		completed_profile: boolean;
	}
}
