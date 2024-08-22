import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable, vendorTable } from "../../lib/db/schema";
import { procedure, router } from "../../server";

export const queries = router({
    getVendor: procedure
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

            const { session, user } = await lucia.validateSession(
                ctx.sessionId
            );
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
        }),
});
