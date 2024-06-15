import { redirect, type RequestHandler } from '@sveltejs/kit';
import { logout } from '@youknowedo/shared/server';

export const GET: RequestHandler = async ({ cookies, locals }) => {
	if (!locals.session) {
		throw new Error('Session not found');
	}

	await logout(locals.session.id, cookies);

	throw redirect(302, '/');
};
