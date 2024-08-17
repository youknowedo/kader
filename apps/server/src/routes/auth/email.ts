import { hash, verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "../../auth";
import { db } from "../../db";
import { userTable } from "../../db/schema";

export const emailRoute = new Hono();

export function isValidEmail(email: string): boolean {
    return /.+@.+/.test(email);
}

emailRoute.post("/signup", async ({ req }) => {
    const formData = await req.formData();
    const username = formData.get("username");
    if (!username || typeof username !== "string") {
        return new Response("Invalid username", {
            status: 400,
        });
    }
    const email = formData.get("email");
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
        return new Response("Invalid email", {
            status: 400,
        });
    }
    const password = formData.get("password");
    if (!password || typeof password !== "string" || password.length < 6) {
        return new Response("Invalid password", {
            status: 400,
        });
    }

    const passwordHash = await hash(password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    const qrId = crypto.getRandomValues(new Uint8Array(20));
    let hexQrId = Buffer.from(qrId).toString("hex");

    try {
        await db.insert(userTable).values({
            id: userId,
            hexQrId: hexQrId,
            username,
            email,
            password_hash: passwordHash,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        return new Response(null, {
            status: 302,
            headers: {
                Location: process.env.APP_URL + "/",
                "Set-Cookie": sessionCookie.serialize(),
            },
        });
    } catch {
        // db error, email taken, etc
        return new Response("Email already used", {
            status: 400,
        });
    }
});

emailRoute.post("/login", async ({ req }) => {
    const formData = await req.formData();
    const email = formData.get("email");
    if (!email || typeof email !== "string") {
        return new Response("Invalid email", {
            status: 400,
        });
    }
    const password = formData.get("password");
    if (!password || typeof password !== "string") {
        return new Response(null, {
            status: 400,
        });
    }

    const user = (
        await db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email))
            .limit(1)
    )[0];

    if (!user) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid emails from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid emails.
        // However, valid emails can be already be revealed with the signup page
        // and a similar timing issue can likely be found in password reset implementation.
        // It will also be much more resource intensive.
        // Since protecting against this is non-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If emails/usernames are public, you may outright tell the user that the username is invalid.
        return new Response("Invalid email or password", {
            status: 400,
        });
    }

    const validPassword = await verify(user.password_hash!, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
    if (!validPassword) {
        return new Response("Invalid email or password", {
            status: 400,
        });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return new Response(null, {
        status: 302,
        headers: {
            Location: process.env.APP_URL + "/",
            "Set-Cookie": sessionCookie.serialize(),
        },
    });
});
