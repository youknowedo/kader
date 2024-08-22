import { eq, inArray } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable, vendorTable } from "../../lib/db/schema";
import { minio } from "../../lib/storage";
import { procedure, router } from "../../server";

export const getSingle = procedure
    .input(z.object({ id: z.string().nullish() }))
    .query(
        async ({
            ctx,
            input,
        }): Promise<{ success: boolean; error?: string; user?: User }> => {
            const { id } = input;

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

            if (!id)
                return {
                    success: true,
                    user,
                };

            if (user.role !== "admin")
                return {
                    success: false,
                    error: "Unauthorized",
                };

            const selectedUser = (
                await db.select().from(userTable).where(eq(userTable.id, id))
            )[0];
            const pfp = await minio.presignedGetObject(
                process.env.MINIO_BUCKET!,
                selectedUser.id + ".webp"
            );

            return {
                success: true,
                user: { ...selectedUser, pfp },
            };
        }
    );

export const getMultiple = procedure
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
