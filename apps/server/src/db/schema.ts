import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    hex_qr_id: text("qr_id").unique(),
    github_id: integer("github_id").unique(),

    completed_profile: boolean("completed_profile").notNull().default(false),
    full_name: text("full_name"),

    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    password_hash: text("password_hash"),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
