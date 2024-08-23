import { eq } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable } from "../../lib/db/schema";
import { minio } from "../../lib/storage";
import { procedure, router } from "../../server";
import type { ResponseData } from "../../types";

export const mutations = {
    updateProfile: procedure
        .input(
            z.object({
                full_name: z.string().email(),
            })
        )
        .mutation(
            async ({
                ctx,
                input,
            }): Promise<ResponseData<{ pfpUploadUrl: string }>> => {
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

                const { full_name: fullName } = input;

                await db
                    .update(userTable)
                    .set({
                        completed_profile: true,
                        full_name: fullName,
                    })
                    .where(eq(userTable.id, user.id));

                const pfpUploadUrl = await minio.presignedPutObject(
                    process.env.MINIO_BUCKET!,
                    user.id + ".webp"
                );

                return {
                    success: true,
                    pfpUploadUrl,
                };
            }
        ),
};
