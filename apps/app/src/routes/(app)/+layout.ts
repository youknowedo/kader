import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	if (!data.user) throw redirect(302, '/login');
};
