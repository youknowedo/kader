import { hasAccess } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	if (!(await hasAccess(event.locals.user, event.params.kaderId))) {
		redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
	}
};
