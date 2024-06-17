import { kaders, usersToKaders } from '$lib/schema';
import { redirect } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		const kader = (await db.select().from(kaders).where(eq(kaders.id, event.params.kaderId)))[0];

		if (!kader) return { valid: false };

		const relation = (
			await db
				.select({
					role: usersToKaders.userRole
				})
				.from(usersToKaders)
				.where(eq(usersToKaders.kaderId, event.params.kaderId))
		)[0];

		if (relation) return { valid: false };

		await db.insert(usersToKaders).values({
			userId: event.locals.user.id,
			userRole: 'member',
			kaderId: event.params.kaderId
		});

		throw redirect(302, '/dashboard/' + event.params.kaderId);
	}

	event.cookies.set('invite', event.params.kaderId, { path: '/' });

	return { valid: true };
};
