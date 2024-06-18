import { accessRole } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	const role = await accessRole(event.locals.user, event.params.kaderId);
	if (!role) throw redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
	else if (role == 'member') throw redirect(302, '/app/' + event.params.kaderId);
};
