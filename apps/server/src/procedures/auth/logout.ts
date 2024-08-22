import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable } from "../../lib/db/schema";
import { procedure } from "../../server";

export const logout = procedure
    .input(
        z.object({
            email: z.string().email(),
            password: z.string().min(6),
        })
    )
    .mutation(async ({ ctx, input }) => {
        if (!ctx.sessionId)
            return {
                success: false,
                error: "Not logged in",
            };

        await lucia.invalidateSession(ctx.sessionId);
        return {
            success: true,
        };
    });
