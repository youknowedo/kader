import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.set('auth_session', '', { path: '/' });
		throw redirect(302, '/login');
	}
};
