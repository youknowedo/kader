import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { Client } from "minio";
import { lucia } from "../auth";
import { db } from "../db";
import { userTable } from "../db/schema";
import sharp = require("sharp");

export const profileRoute = new Hono();

const minio = new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: +(process.env.MINIO_PORT ?? 9000),
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
    useSSL: false,
});

minio.bucketExists(process.env.MINIO_BUCKET!).then((exists) => {
    if (exists) {
        console.log("Bucket " + process.env.MINIO_BUCKET + " exists.");
    } else {
        console.log("Bucket " + process.env.MINIO_BUCKET + " does not exist.");
        return new Response("Bucket does not exist", {
            status: 500,
        });
    }
}, console.error);

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
            Location: process.env.APP_URL + "/",
        },
    });
});
