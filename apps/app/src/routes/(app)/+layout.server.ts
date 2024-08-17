import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(304, '/login');
	console.log('layout server load');
	console.log(locals);

	return {};
};
