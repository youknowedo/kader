import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
    "admin",
    "vendor",
    "member",
    "user",
    "rejected",
]);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    hex_qr_id: text("qr_id").unique(),
    vendor_id: text("vendor_id"),

    role: roleEnum("role").notNull().default("user"),

    completed_profile: boolean("completed_profile").notNull().default(false),
    full_name: text("full_name"),

    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    email_verified: boolean("email_verified").notNull().default(false),
    password_hash: text("password_hash"),
});
export const userRelations = relations(userTable, ({ one, many }) => ({
    vendor: one(vendorTable),
    sessions: many(sessionTable),
}));

export const vendorTable = pgTable("vendor", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    owner: text("owner")
        .notNull()
        .references(() => userTable.id),
});
export const vendorRelations = relations(vendorTable, ({ many }) => ({
    users: many(userTable),
}));

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

export const verificationCodesTable = pgTable("verification_codes", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const resetPasswordTable = pgTable("reset_password", {
    tokenHash: text("token_hash").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
