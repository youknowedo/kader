import { verify } from "@node-rs/argon2";
import { eq, inArray } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable, vendorTable } from "../../lib/db/schema";
import { procedure, router } from "../../server";
import type { ResponseData, Vendor } from "../../types";

export const queries = {
    getSingle: procedure.input(z.string()).query(
        async ({
            ctx,
            input: id,
        }): Promise<
            ResponseData<{
                vendor: Vendor;
            }>
        > => {
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

            if (
                user.role !== "admin" &&
                user.role !== "vendor" &&
                user.vendor_id !== id
            )
                return {
                    success: false,
                    error: "Unauthorized",
                };

            const vendor = await db
                .select()
                .from(vendorTable)
                .where(eq(vendorTable.id, id));

            const users = await db
                .select({})
                .from(userTable)
                .where(eq(userTable.vendor_id, id));

            return {
                success: true,
                vendor: {
                    ...vendor[0],
                    numOfUsers: users.length,
                },
            };
        }
    ),

    getMultiple: procedure.input(z.array(z.string()).nullish()).query(
        async ({
            ctx,
            input: ids,
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
            const vendors = await (ids
                ? vendorsSelect.where(inArray(vendorTable.id, ids))
                : vendorsSelect);

            const numOfUsers: number[] = [];
            const owners: Omit<User, "pfp">[] = [];

            for (const vendor of vendors) {
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
            }

            return {
                success: true,
                vendors: vendors.map((vendor, i) => ({
                    ...vendor,
                    numOfUsers: numOfUsers[i],
                    owner: owners[i],
                })),
            };
        }
    ),
};
