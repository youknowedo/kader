import { redirect } from '@sveltejs/kit';
import { loginAction, loginServerLoad } from '@youknowedo/shared/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) redirect(302, '/dashboard');

	return loginServerLoad();
};

export const actions = {
	default: async (e) => {
		await loginAction(e);

		redirect(302, '/dashboard');
	}
};
