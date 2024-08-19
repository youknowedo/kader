import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "../auth";
import { db } from "../db";
import { userTable } from "../db/schema";
import { minio } from "../storage";
import sharp = require("sharp");

export const profileRoute = new Hono();

profileRoute.post("/", async (c) => {
    const { session, user } = await lucia.validateSession(
        getCookie(c, "auth_session") ?? ""
    );
    if (!session) {
        return new Response(null, {
            status: 400,
        });
    }

    const formData = await c.req.formData();

    const picture: string | Blob | null = formData.get("picture");
    if (!picture || typeof picture === "string") {
        return new Response("No picture found", {
            status: 400,
        });
    }

    const full_name = formData.get("full_name");
    if (!full_name || typeof full_name !== "string") {
        return new Response("No full name found", {
            status: 400,
        });
    }

    const pictureBuffer = await picture.arrayBuffer();
    const buffer = await sharp(pictureBuffer).webp().toBuffer();

    minio.putObject(
        process.env.MINIO_BUCKET!,
        user.id + ".webp",
        buffer,
        pictureBuffer.byteLength,
        {
            "Content-Type": "image/webp",
        }
    );

    await db
        .update(userTable)
        .set({
            completed_profile: true,
            full_name,
        })
        .where(eq(userTable.id, user.id));

    return new Response(null, {
        status: 302,
        headers: {
            Location:
                (formData.get("redirect") ??
                    c.req.header("Origin") ??
                    process.env.APP_URL) + "/",
        },
    });
});
