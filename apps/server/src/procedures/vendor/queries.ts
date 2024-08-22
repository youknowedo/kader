import { verify } from "@node-rs/argon2";
import { eq, inArray } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable, vendorTable } from "../../lib/db/schema";
import { procedure, router } from "../../server";

export const getSingle = procedure
    .input(
        z.object({
            vendorId: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        if (!ctx.sessionId)
            return {
                success: false,
                error: "Unauthenticated",
            };

        const { session, user } = await lucia.validateSession(ctx.sessionId);
        if (!session)
            return {
                success: false,
                error: "Unauthenticated",
            };

        const { vendorId } = input;

        if (
            user.role !== "admin" &&
            user.role !== "vendor" &&
            user.vendor_id !== vendorId
        )
            return {
                success: false,
                error: "Unauthorized",
            };

        const vendor = await db
            .select()
            .from(vendorTable)
            .where(eq(vendorTable.id, vendorId));

        const users = await db
            .select({})
            .from(userTable)
            .where(eq(userTable.vendor_id, vendorId));

        return {
            success: true,
            vendor: {
                ...vendor[0],
                numOfUsers: users.length,
            },
        };
    });

export const getMultiple = procedure
    .input(
        z.object({
            ids: z.array(z.string()).nullish(),
        })
    )
    .query(
        async ({
            ctx,
            input,
        }): Promise<{
            success: boolean;
            error?: string;
            vendors?: {
                id: string;
                name: string;
                description: string | null;
                numOfUsers: number;
                owner: Omit<User, "pfp">;
            }[];
        }> => {
            if (!ctx.sessionId)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            const { session, user } = await lucia.validateSession(
                ctx.sessionId
            );
            if (!session)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            if (user.role !== "admin")
                return {
                    success: false,
                    error: "Unauthorized",
                };

            const vendorsSelect = db.select().from(vendorTable);
            const vendors = await (input.ids
                ? vendorsSelect.where(inArray(vendorTable.id, input.ids))
                : vendorsSelect);

            const numOfUsers: number[] = [];
            const owners: Omit<User, "pfp">[] = [];
            vendors.forEach(async (vendor) => {
                const users = await db
                    .select({})
                    .from(userTable)
                    .where(eq(userTable.vendor_id, vendor.id));
                const owner = await db
                    .select()
                    .from(userTable)
                    .where(eq(userTable.id, vendor.owner));

                numOfUsers.push(users.length);
                owners.push(owner[0]);
            });

            return {
                success: true,
                vendors: vendors.map((vendor, i) => ({
                    ...vendor,
                    numOfUsers: numOfUsers[i],
                    owner: owners[i],
                })),
            };
        }
    );
