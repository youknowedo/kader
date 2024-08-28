import { eq } from "drizzle-orm";
import { generateIdFromEntropySize, TimeSpan } from "lucia";
import { createDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { z } from "zod";
import { db } from "../../lib/db/index.js";
import { resetPasswordTable, userTable } from "../../lib/db/schema.js";
import { createMailTransporter } from "../../lib/utils.js";
import { procedure, router } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const reset = router({
    send: procedure
        .input(z.string().email())
        .mutation(async ({ ctx, input: email }): Promise<ResponseData> => {
            const user = (
                await db
                    .select({ id: userTable.id })
                    .from(userTable)
                    .where(eq(userTable.email, email))
                    .limit(1)
            )[0];
            if (!user)
                return {
                    success: false,
                    error: "No user with that email",
                };

            await db
                .delete(resetPasswordTable)
                .where(eq(resetPasswordTable.userId, user.id));

            const tokenId = generateIdFromEntropySize(25); // 40 character
            const tokenHash = encodeHex(
                await sha256(new TextEncoder().encode(tokenId))
            );
            await db.insert(resetPasswordTable).values({
                tokenHash: tokenHash,
                userId: user.id,
                expiresAt: createDate(new TimeSpan(2, "h")),
            });

            const transporter = createMailTransporter();

            const info = transporter.sendMail(
                {
                    from: '"Kader" <no-reply@kader.se>',
                    to: email,
                    subject: "Your reset code has arrived!",
                    html: `Your reset code is: <b>${tokenId}</b>`,
                },
                (err, info) => {
                    if (err) {
                        console.error("error");
                        console.error(err);
                    }
                    console.log(info);
                    console.log(`Message sent: ${info.messageId}`);
                }
            );

            return {
                success: true,
            };
        }),
});
