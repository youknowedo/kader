import { usersToKaders } from '$lib/schema';
import { accessRole } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db, users } from '@youknowedo/shared/server';
import { eq, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { User } from './data';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) throw redirect(302, '/login');

	const role = await accessRole(event.locals.user, event.params.kaderId);
	if (!role) throw redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
	else if (role == 'member') throw redirect(302, '/app/' + event.params.kaderId);

	const relations = await db
		.select()
		.from(usersToKaders)
		.where(eq(usersToKaders.kaderId, event.params.kaderId));
	const kaderUsers = await db
		.select()
		.from(users)
		.where(
			inArray(
				users.id,
				relations.map((r) => r.userId)
			)
		);

	const members: User[] = kaderUsers
		.map((user): User | null => {
			const relation = relations.find((r) => r.userId === user.id);

			if (!relation) return null;

			return {
				id: user.id,
				givenName: user.givenName,
				surname: user.surname,
				email: user.email ?? '',
				role: relation.userRole,
				paid: false
			};
		})
		.filter((m) => m !== null);

	return { members };
};
