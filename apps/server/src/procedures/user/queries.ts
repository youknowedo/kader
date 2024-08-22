import { eq, inArray } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable } from "../../lib/db/schema";
import { minio } from "../../lib/storage";
import { procedure } from "../../server";
import type { ResponseData } from "../../types";

export const queries = {
    getSingle: procedure
        .input(z.string().nullish())
        .query(
            async ({
                ctx,
                input: id,
            }): Promise<{ success: boolean; error?: string; user?: User }> => {
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
                    await db
                        .select()
                        .from(userTable)
                        .where(eq(userTable.id, id))
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
        ),

    getMultiple: procedure
        .input(
            z.object({
                ids: z.array(z.string()).nullish(),
                vendorId: z.string().nullish(),
            })
        )
        .query(
            async ({
                ctx,
                input,
            }): Promise<ResponseData<{ users: User[] }>> => {
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

                const { ids, vendorId } = input;

                const userSelect = db.select().from(userTable);
                const users = await (ids
                    ? userSelect.where(inArray(userTable.id, ids))
                    : vendorId
                      ? userSelect.where(eq(userTable.vendor_id, vendorId))
                      : userSelect);

                const pfp = await Promise.all(
                    users.map((u) =>
                        minio.presignedGetObject(
                            process.env.MINIO_BUCKET!,
                            u.id + ".webp"
                        )
                    )
                );

                return {
                    success: true,
                    users: users.map((u, i) => ({ ...u, pfp: pfp[i] })),
                };
            }
        ),
};
