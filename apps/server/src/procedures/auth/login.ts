import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable } from "../../lib/db/schema";
import { procedure } from "../../server";

export const login = procedure
    .input(
        z.object({
            email: z.string().email(),
            password: z.string().min(6),
        })
    )
    .mutation(async ({ input }) => {
        const { email, password } = input;

        const user = (
            await db
                .select()
                .from(userTable)
                .where(eq(userTable.email, email))
                .limit(1)
        )[0];

        if (!user) {
            // NOTE:
            // Returning immediately allows malicious actors to figure out valid emails from response times,
            // allowing them to only focus on guessing passwords in brute-force attacks.
            // As a preventive measure, you may want to hash passwords even for invalid emails.
            // However, valid emails can be already be revealed with the signup page
            // and a similar timing issue can likely be found in password reset implementation.
            // It will also be much more resource intensive.
            // Since protecting against this is non-trivial,
            // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
            // If emails/usernames are public, you may outright tell the user that the username is invalid.
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        const validPassword = await verify(user.password_hash!, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });
        if (!validPassword) {
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        return {
            success: true,
            sessionCookie,
        };
    });
