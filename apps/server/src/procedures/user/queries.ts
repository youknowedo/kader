import { verify } from "@node-rs/argon2";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable, vendorTable } from "../../lib/db/schema";
import { procedure } from "../../server";

export const getUsers = procedure
    .input(
        z.object({
            ids: z.array(z.string()).nullish(),
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

        if (user.role !== "admin")
            return {
                success: false,
                error: "Unauthorized",
            };

        const { ids } = input;

        const userSelect = db.select().from(userTable);

        return {
            success: true,
            users: await (ids
                ? userSelect.where(inArray(userTable.id, ids))
                : userSelect),
        };
    });
