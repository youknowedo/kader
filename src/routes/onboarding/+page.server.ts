import { kaders, usersToKaders } from '$lib/schema';
import { redirect } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) throw redirect(302, '/login');

	const inviteId = event.cookies.get('invite');

	if (!inviteId) return;

	const kader = (await db.select().from(kaders).where(eq(kaders.id, inviteId)))[0];

	// TODO: toast alerting
	if (!kader) return;

	await db.insert(usersToKaders).values({
		userId: event.locals.user.id,
		userRole: 'member',
		kaderId: inviteId
	});

	throw redirect(302, '/dashboard/' + inviteId);
};
