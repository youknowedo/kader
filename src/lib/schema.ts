import { relations } from 'drizzle-orm';
import { integer, pgSchema, primaryKey, text } from 'drizzle-orm/pg-core';

export const schema = pgSchema('kader');
export const userRoles = schema.enum('user_roles', ['owner', 'admin', 'member']);

export const kaders = schema.table('kaders', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	school: text('school').notNull(),
	city: text('city').notNull()
});
export const kadersRelations = relations(kaders, ({ many }) => ({
	users_to_kaders: many(usersToKaders),
	subscription_plans: many(subscriptionPlans)
}));

export const usersToKaders = schema.table(
	'users_to_kaders',
	{
		userId: text('user_id').notNull(),
		userRole: userRoles('user_role').notNull(),
		kaderId: text('kader_id')
			.notNull()
			.references(() => kaders.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.kaderId] })
	})
);
export const usersToKadersRelations = relations(usersToKaders, ({ one }) => ({
	kader: one(kaders, {
		fields: [usersToKaders.kaderId],
		references: [kaders.id]
	})
}));

export const subscriptionPlans = schema.table('subscription_plans', {
	id: text('id').primaryKey(),
	kaderId: text('kader_id').notNull(),
	name: text('name').notNull(),
	price: integer('price').notNull(),
	currency: text('currency').notNull(),
	periodMonth: integer('period_month').notNull(),
	periodDay: integer('period_day').notNull()
});
export const subscriptionRelations = relations(subscriptionPlans, ({ one }) => ({
	kader: one(kaders, {
		fields: [subscriptionPlans.kaderId],
		references: [kaders.id]
	})
}));
