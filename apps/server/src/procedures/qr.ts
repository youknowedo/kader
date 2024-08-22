import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../lib/auth";
import { db } from "../lib/db";
import { userTable } from "../lib/db/schema";
import { procedure } from "../server";

export const getQr = procedure.query(async ({ ctx, input }) => {
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

    return {
        success: true,
        qr: user.hex_qr_id,
    };
});
