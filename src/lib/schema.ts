import { relations } from 'drizzle-orm';
import { pgSchema, primaryKey, text } from 'drizzle-orm/pg-core';

export const schema = pgSchema('kader');

export const kaders = schema.table('kaders', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	school: text('school').notNull(),
	city: text('city').notNull()
});
export const kadersRelations = relations(kaders, ({ many }) => ({
	usersToKaders: many(usersToKaders)
}));

export const userRoles = schema.enum('user_roles', ['owner', 'admin', 'member']);

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
