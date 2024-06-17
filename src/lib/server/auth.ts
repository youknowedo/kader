import { usersToKaders } from '$lib/schema';
import { db } from '@youknowedo/shared/server';
import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';

export const hasAccess = async (user: User, kaderId: string) => {
	const relation = await db
		.select({})
		.from(usersToKaders)
		.where(and(eq(usersToKaders.kaderId, kaderId), eq(usersToKaders.userId, user.id)))
		.limit(1);

	console.log(relation);

	if (relation.length === 0) return false;

	return true;
};
