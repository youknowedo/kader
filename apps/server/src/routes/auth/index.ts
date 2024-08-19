import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "../../auth";
import { emailRoute } from "./email";
import { validateRoute } from "./validate";

export const authRoute = new Hono();

authRoute.route("/email", emailRoute).route("/validate", validateRoute);

authRoute.post("/logout", async (c) => {
    const formData = await c.req.formData();

    const session_id = formData.get("session_id");
    if (!session_id || typeof session_id !== "string") {
        return new Response("Invalid session_id", {
            status: 400,
        });
    }

    const { session } = await lucia.validateSession(session_id as string);
    if (!session) {
        return new Response("Invalid session", {
            status: 400,
        });
    }

    await lucia.invalidateSession(session?.id);
    return new Response(null, {
        status: 302,
        headers: {
            "Set-Cookie": lucia.createBlankSessionCookie().serialize(),
            Location:
                (formData.get("redirect") ??
                    c.req.header("Origin") ??
                    process.env.APP_URL) + "/",
        },
    });
});
