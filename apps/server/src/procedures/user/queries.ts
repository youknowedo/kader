import { eq, inArray, ne } from "drizzle-orm";
import type { User } from "lucia";
import { Secret, TOTP } from "otpauth";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { userTable } from "../../lib/db/schema.js";
import { minio } from "../../lib/storage.js";
import { procedure } from "../../server.js";
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
                        error: "Unauthenticated 1",
                    };

                const { session, user } = await lucia.validateSession(
                    ctx.sessionId
                );
                if (!session)
                    return {
                        success: false,
                        error: "Unauthenticated 2",
                    };

                if (!id)
                    return {
                        success: true,
                        user: user && {
                            ...user,
                            pfp: await minio.presignedGetObject(
                                process.env.MINIO_BUCKET!,
                                user.id + ".webp"
                            ),
                        },
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

                return {
                    success: true,
                    user: selectedUser && {
                        ...selectedUser,
                        pfp: await minio.presignedGetObject(
                            process.env.MINIO_BUCKET!,
                            selectedUser.id + ".webp"
                        ),
                    },
                };
            }
        ),

    getMultiple: procedure
        .input(
            z
                .object({
                    ids: z.array(z.string()).nullish(),
                    vendorId: z.string().nullish(),
                    noVendors: z.boolean().nullish(),
                })
                .nullish()
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

                const userSelect = db.select().from(userTable);
                const users = await (input?.ids
                    ? userSelect.where(inArray(userTable.id, input?.ids))
                    : input?.vendorId
                      ? userSelect.where(
                            eq(userTable.vendor_id, input?.vendorId)
                        )
                      : input?.noVendors
                        ? userSelect.where(ne(userTable.role, "vendor"))
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
                    users: users.map((u, i) => u && { ...u, pfp: pfp[i] }),
                };
            }
        ),
    fromQr: procedure
        .input(
            z.object({
                token: z.string(),
                userId: z.string(),
            })
        )
        .query(
            async ({ ctx, input }): Promise<ResponseData<{ user: User }>> => {
                if (!ctx.sessionId)
                    return {
                        success: false,
                        error: "Unauthenticated",
                    };

                const { session } = await lucia.validateSession(ctx.sessionId);
                if (!session)
                    return {
                        success: false,
                        error: "Unauthenticated",
                    };

                const user = (
                    await db
                        .select()
                        .from(userTable)
                        .where(eq(userTable.id, input.userId))
                )[0];

                if (!user.hex_qr_id)
                    return {
                        success: false,
                        error: "No QR ID",
                    };

                const uint = Uint8Array.from(
                    Buffer.from(user.hex_qr_id, "hex")
                );
                const secret = new Secret({ buffer: uint.buffer });
                const totp = new TOTP({
                    algorithm: "SHA1",
                    digits: 6,
                    period: 30,
                    secret,
                });

                const valid =
                    totp.validate({
                        token: input.token,
                    }) !== null;

                if (!valid)
                    return {
                        success: false,
                        error: "Invalid Token",
                    };

                return {
                    success: true,
                    user: user && {
                        ...user,
                        pfp: await minio.presignedGetObject(
                            process.env.MINIO_BUCKET!,
                            user.id + ".webp"
                        ),
                    },
                };
            }
        ),
};
