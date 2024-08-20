import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "../auth";
import { db } from "../db";
import { userTable, vendorTable } from "../db/schema";

export const vendorRoute = new Hono();

vendorRoute.post("/all", async (c) => {
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

    const vendors = await db.select().from(vendorTable);

    return new Response(JSON.stringify(vendors));
});

type NumOfUsersData = {
    sessionId: string;
    vendorId: string;
};

vendorRoute.post("/numOfUsers", async (c) => {
    const data: NumOfUsersData = await c.req.json();

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

    const users = await db
        .select({})
        .from(userTable)
        .where(eq(userTable.vendor_id, data.vendorId));

    return new Response(JSON.stringify(users.length));
});

type UsersData = {
    sessionId: string;
    vendorId: string;
};

vendorRoute.post("/users", async (c) => {
    const data: UsersData = await c.req.json();

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

    const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.vendor_id, data.vendorId));

    return new Response(JSON.stringify(users));
});
