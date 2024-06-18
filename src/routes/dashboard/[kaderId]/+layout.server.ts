import { kaders, usersToKaders } from '$lib/schema';
import { accessRole } from '$lib/server/auth';
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

	// TODO: Create join page where you can search kaders and join them
	if (relations.length === 0) redirect(302, '/app/join');

	const role = await accessRole(event.locals.user, event.params.kaderId);
	// TODO: Create join page where you can ask to join a kader
	if (!role) throw redirect(302, '/app/' + event.params.kaderId + '/join');

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
