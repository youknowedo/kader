import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { drizzle } from "drizzle-orm/node-postgres";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Pool } from "pg";

const pool = new Pool();
export const db = drizzle(pool);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    github_id: integer("github_id").unique(),
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

export const adapter = new DrizzlePostgreSQLAdapter(
    db,
    sessionTable,
    userTable
);
