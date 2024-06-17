import { kaders, usersToKaders } from '$lib/schema';
import { redirect } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { eq, inArray } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');
	const relations = await db
		.select({
			kaderId: usersToKaders.kaderId
		})
		.from(usersToKaders)
		.where(eq(usersToKaders.userId, event.locals.user.id));

	if (relations.length === 0) redirect(302, '/onboarding');

	const userKaders = await db
		.select({
			id: kaders.id,
			name: kaders.name
		})
		.from(kaders)
		.where(
			inArray(
				kaders.id,
				relations.map((r) => r.kaderId)
			)
		);

	return {
		email: event.locals.user.email,
		kaders: userKaders
	};
};
