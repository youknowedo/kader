import { inArray } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "../auth";
import { db } from "../db";
import { userTable, vendorTable } from "../db/schema";

export const userRoute = new Hono();

type SomeData = {
    sessionId: string;
    users: string[];
};

userRoute.post("/all", async (c) => {
    const sessionId = await c.req.text();

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
        console.log("no session");
        return new Response(null, {
            status: 400,
        });
    }

    if (user.role !== "admin") {
        return new Response(null, {
            status: 403,
        });
    }

    const users = await db.select().from(userTable);

    return new Response(JSON.stringify(users));
});

userRoute.post("/some", async (c) => {
    const data: SomeData = await c.req.json();

    const { session, user } = await lucia.validateSession(data.sessionId);
    if (!session) {
        console.log("no session");
        return new Response(null, {
            status: 400,
        });
    }

    if (user.role !== "admin") {
        return new Response(null, {
            status: 403,
        });
    }

    if (data.users.length === 0) {
        return new Response(null, {
            status: 400,
        });
    }

    const users = await db
        .select()
        .from(userTable)
        .where(inArray(userTable.id, data.users));

    return new Response(JSON.stringify(users));
});
