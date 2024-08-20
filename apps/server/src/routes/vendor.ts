import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "../auth";
import { db } from "../db";
import { vendorTable } from "../db/schema";

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
