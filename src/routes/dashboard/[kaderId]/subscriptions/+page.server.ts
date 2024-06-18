import { subscriptionPlans } from '$lib/schema';
import { hasAccess } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { createFormSchema, editFormSchema, type EditFormSchema } from './schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	if (!(await hasAccess(event.locals.user, event.params.kaderId))) {
		redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
	}

	const s = await db
		.select({
			id: subscriptionPlans.id,
			name: subscriptionPlans.name,
			price: subscriptionPlans.price,
			currency: subscriptionPlans.currency,
			periodMonth: subscriptionPlans.periodMonth,
			periodDay: subscriptionPlans.periodDay
		})
		.from(subscriptionPlans)
		.where(eq(subscriptionPlans.kaderId, event.params.kaderId))
		.orderBy(subscriptionPlans.id);

	const subscriptions: (Infer<EditFormSchema> & {
		form: SuperValidated<Infer<EditFormSchema>, unknown, Infer<EditFormSchema>>;
	})[] = [];

	for (const sub of s) {
		const form = await superValidate(zod(editFormSchema), {
			id: sub.id
		});
		subscriptions.push({ ...sub, form });
	}

	return {
		createForm: await superValidate(zod(createFormSchema)),
		subscriptions
	};
};

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) throw redirect(302, '/login');

		if (!(await hasAccess(event.locals.user, event.params.kaderId))) {
			redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
		}

		const form = await superValidate(event, zod(createFormSchema));
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
	},
	edit: async (event) => {
		if (!event.locals.user) throw redirect(302, '/login');

		if (!(await hasAccess(event.locals.user, event.params.kaderId))) {
			redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
		}

		const form = await superValidate(event, zod(editFormSchema));
		if (!form.valid) {
			return {
				status: 400,
				form
			};
		}

		const { id, name, price, currency, periodMonth, periodDay } = form.data;

		// TODO: check if period is valid

		await db
			.update(subscriptionPlans)
			.set({
				kaderId: event.params.kaderId,
				name,
				price,
				currency,
				periodMonth,
				periodDay
			})
			.where(eq(subscriptionPlans.id, id));
	}
};
