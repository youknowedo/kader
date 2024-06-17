import { kaders, usersToKaders } from '$lib/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return fail(401);

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const { name, school, city } = form.data;

		const id = generateIdFromEntropySize(10);

		await db.insert(kaders).values({
			id,
			name,
			school,
			city
		});
		await db.insert(usersToKaders).values({
			userId: event.locals.user.id,
			userRole: 'owner',
			kaderId: id
		});

		redirect(302, '/dashboard/' + id);
	}
};
