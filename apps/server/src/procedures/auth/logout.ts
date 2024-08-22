import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { userTable } from "../../lib/db/schema";
import { procedure } from "../../server";

export const logout = procedure.mutation(async ({ ctx, input }) => {
    if (!ctx.sessionId)
        return {
            success: false,
            error: "Not logged in",
        };

    await lucia.invalidateSession(ctx.sessionId);

    const sessionCookie = lucia.createBlankSessionCookie();
    ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());

    return {
        success: true,
    };
});
