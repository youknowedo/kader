import { subscriptionPlans } from '$lib/schema';
import { hasAccess } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { createSchema } from './schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	if (!(await hasAccess(event.locals.user, event.params.kaderId))) {
		redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
	}

	const subscriptions = await db
		.select({
			id: subscriptionPlans.id,
			name: subscriptionPlans.name,
			price: subscriptionPlans.price,
			currency: subscriptionPlans.currency
		})
		.from(subscriptionPlans)
		.where(eq(subscriptionPlans.kaderId, event.params.kaderId));

	return {
		createForm: await superValidate(zod(createSchema)),
		subscriptions
	};
};

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) return redirect(302, '/login');

		if (!(await hasAccess(event.locals.user, event.params.kaderId))) {
			redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
		}

		const form = await superValidate(event, zod(createSchema));
		if (!form.valid) {
			return {
				status: 400,
				form
			};
		}

		const { name, price, currency, periodMonth, periodDay } = form.data;

		// TODO: check if period is valid

		await db.insert(subscriptionPlans).values({
			id: generateIdFromEntropySize(10),
			kaderId: event.params.kaderId,
			name,
			price,
			currency,
			periodMonth,
			periodDay
		});

		return redirect(302, '/dashboard/' + event.params.kaderId + '/subscriptions');
	}
};
