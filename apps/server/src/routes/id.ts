import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "../auth";
import { db } from "../db";
import { userTable } from "../db/schema";

export const idRoute = new Hono();

idRoute.get("/", async (c) => {
    const { session, user } = await lucia.validateSession(
        getCookie(c, "auth_session") ?? ""
    );
    if (!session) {
        return new Response(null, {
            status: 400,
        });
    }

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

    return new Response(user.hex_qr_id);
});
