import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "../auth";
import { db } from "../db";
import { userTable } from "../db/schema";

export const idRoute = new Hono();

idRoute.post("/", async (c) => {
    const sessionId = await c.req.text();

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
        return new Response("no session 2", {
            status: 400,
        });
    }

    if (!user.completed_profile) {
        return new Response(
            JSON.stringify({
                completedProfile: false,
            }),
            {
                status: 400,
            }
        );
    }
    console.log(user.hex_qr_id);

    if (!user.hex_qr_id) {
        // Add a new QR ID to the user
        const qrId = crypto.getRandomValues(new Uint8Array(20));
        user.hex_qr_id = Buffer.from(qrId).toString("hex");

        await db
            .update(userTable)
            .set({
                hex_qr_id: user.hex_qr_id,
            })
            .where(eq(userTable.id, user.id));
    }

    return new Response(
        JSON.stringify({ completedProfile: true, qr: user.hex_qr_id })
    );
});
