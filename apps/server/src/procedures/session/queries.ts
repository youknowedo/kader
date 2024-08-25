import { lucia } from "../../lib/auth.js";
import { procedure, router } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const queries = {
    validate: procedure.query(async ({ ctx, input }): Promise<ResponseData> => {
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

        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            sessionCookie.attributes.sameSite =
                process.env.NODE_ENV === "production" ? "none" : "lax";
            sessionCookie.attributes.secure =
                process.env.NODE_ENV === "production";
            sessionCookie.attributes.domain = process.env.APP_URL?.replace(
                "https://",
                ""
            );

            ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
            return {
                success: true,
            };
        }
        if (!session || !user) {
            const sessionCookie = lucia.createBlankSessionCookie();
            sessionCookie.attributes.sameSite =
                process.env.NODE_ENV === "production" ? "none" : "lax";
            sessionCookie.attributes.secure =
                process.env.NODE_ENV === "production";
            sessionCookie.attributes.domain = process.env.APP_URL?.replace(
                "https://",
                ""
            );

            ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
            return {
                success: true,
            };
        }

        return {
            success: true,
        };
    }),
};
