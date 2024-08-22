import express from "express";
import { lucia } from "../../lib/auth";
import { minio } from "../../lib/storage";

export const validateRoute = express.Router();

validateRoute.post("/session", async (req, res, next) => {
    // express formData
    const formData: FormData = await req.body;

    const sessionId = formData.get("session_id");
    if (!sessionId || typeof sessionId !== "string") {
        return new Response(null, {
            status: 400,
        });
    }

    const { session, user } = await lucia.validateSession(sessionId);

    const responseData = JSON.stringify({ session, user });

    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        return new Response(responseData, {
            status: 200,
            headers: {
                "Set-Cookie": sessionCookie.serialize(),
            },
        });
    }
    if (!session || !user) {
        const sessionCookie = lucia.createBlankSessionCookie();
        return new Response(responseData, {
            status: 200,
            headers: {
                "Set-Cookie": sessionCookie.serialize(),
            },
        });
    }

    const pfp = await minio.presignedUrl(
        "GET",
        process.env.MINIO_BUCKET!,
        user.id + ".webp",
        24 * 60 * 60
    );

    return new Response(JSON.stringify({ session, user, pfp }));
});
