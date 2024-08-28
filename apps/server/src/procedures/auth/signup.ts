import { hash } from "argon2";
import { generateIdFromEntropySize, type User } from "lucia";
import crypto from "node:crypto";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { userTable } from "../../lib/db/schema.js";
import { minio } from "../../lib/storage.js";
import { sendVerificationCode } from "../../lib/utils.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const signup = procedure
    .input(
        z.object({
            username: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(6),
        })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseData<{ user: User }>> => {
        const { username, email, password } = input;

        const passwordHash = await hash(password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            hashLength: 32,
            parallelism: 1,
        });
        const userId = generateIdFromEntropySize(10); // 16 characters long

        const qrId = crypto.getRandomValues(new Uint8Array(20));
        let hex_qr_id = Buffer.from(qrId).toString("hex");

        try {
            await db.insert(userTable).values({
                id: userId,
                hex_qr_id: hex_qr_id,
                username,
                email,
                password_hash: passwordHash,
            });

            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            sessionCookie.attributes.sameSite = "lax";
            sessionCookie.attributes.secure =
                process.env.NODE_ENV === "production";
            if (process.env.NODE_ENV === "production")
                sessionCookie.attributes.domain = ctx.req.headers.origin
                    ?.replace(/^https?:\/\//, "")
                    .replace(/^http?:\/\//, "");

            sendVerificationCode(userId);

            ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
            ctx.res.setHeader("Location", "/");

            return {
                success: true,
                user: {
                    id: userId,
                    email,
                    email_verified: false,
                    username,
                    completed_profile: false,
                    full_name: null,
                    role: "user",
                    vendor_id: null,
                    pfp: null,
                    hex_qr_id,
                },
            };
        } catch {
            // db error, email taken, etc
            return {
                success: false,
                error: "Email already taken",
            };
        }
    });
