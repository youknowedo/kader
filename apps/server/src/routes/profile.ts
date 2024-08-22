import { eq } from "drizzle-orm";
import express from "express";
import sharp from "sharp";
import { lucia } from "../lib/auth";
import { db } from "../lib/db";
import { userTable } from "../lib/db/schema";
import { minio } from "../lib/storage";

export const profileRoute = express.Router();

profileRoute.post("/", async (req, res, next) => {
    const { session, user } = await lucia.validateSession(
        req.cookies["auth_session"] ?? ""
    );
    if (!session) {
        return new Response(null, {
            status: 400,
        });
    }

    const formData = await req.body;

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
                    req.header("Origin") ??
                    process.env.APP_URL) + "/",
        },
    });
});
