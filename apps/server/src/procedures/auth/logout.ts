import { lucia } from "../../lib/auth.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const logout = procedure.mutation(
    async ({ ctx, input }): Promise<ResponseData> => {
        if (!ctx.sessionId)
            return {
                success: false,
                error: "Not logged in",
            };

        await lucia.invalidateSession(ctx.sessionId);

        const sessionCookie = lucia.createBlankSessionCookie();
        sessionCookie.attributes.sameSite =
            process.env.NODE_ENV === "production" ? "none" : "lax";
        sessionCookie.attributes.secure = true;
        sessionCookie.attributes.domain = process.env.APP_URL?.replace(
            process.env.NODE_ENV === "production" ? "https://" : "http://",
            ""
        );

        ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());

        return {
            success: true,
        };
    }
);
