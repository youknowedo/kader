import { subscriptionPlans } from '$lib/schema';
import { accessRole } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db } from '@youknowedo/shared/server';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	createFormSchema,
	deleteFormSchema,
	editFormSchema,
	type DeleteFormSchema,
	type EditFormSchema
} from './schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	const role = await accessRole(event.locals.user, event.params.kaderId);
	if (!role) throw redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
	else if (role == 'member') throw redirect(302, '/app/' + event.params.kaderId);

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
		editForm: SuperValidated<Infer<EditFormSchema>, unknown, Infer<EditFormSchema>>;
		deleteForm: SuperValidated<Infer<DeleteFormSchema>, unknown, Infer<DeleteFormSchema>>;
	})[] = [];

	for (const sub of s) {
		const editForm = await superValidate(zod(editFormSchema), {
			id: 'edit-' + sub.id
		});
		const deleteForm = await superValidate(zod(deleteFormSchema), {
			id: 'delete-' + sub.id
		});
		subscriptions.push({ ...sub, editForm, deleteForm });
	}

	return {
		createForm: await superValidate(zod(createFormSchema)),
		subscriptions
	};
};

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) throw redirect(302, '/login');

		const role = await accessRole(event.locals.user, event.params.kaderId);
		if (!role) throw redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
		else if (role == 'member') throw redirect(302, '/app/' + event.params.kaderId);

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

		const role = await accessRole(event.locals.user, event.params.kaderId);
		if (!role) throw redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
		else if (role == 'member') throw redirect(302, '/app/' + event.params.kaderId);

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
	},
	delete: async (event) => {
		if (!event.locals.user) throw redirect(302, '/login');

		const role = await accessRole(event.locals.user, event.params.kaderId);
		if (!role) throw redirect(302, '/dashboard/noAccess/' + event.params.kaderId);
		else if (role == 'member') throw redirect(302, '/app/' + event.params.kaderId);

		const form = await superValidate(event, zod(deleteFormSchema));
		if (!form.valid) {
			return {
				status: 400,
				form
			};
		}

		const { id } = form.data;

		await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id));
	}
};
