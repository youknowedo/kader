import { usersToKaders } from '$lib/schema';
import { redirect } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	const userKaders = await db
		.select({
			kaderId: usersToKaders.kaderId
		})
		.from(usersToKaders)
		.where(eq(usersToKaders.userId, event.locals.user.id))
		.limit(1);

	if (userKaders.length === 0) redirect(302, '/onboarding');

	redirect(302, '/dashboard/' + userKaders[0].kaderId);
};
