import { eq } from "drizzle-orm";
import express from "express";
import { lucia } from "../lib/auth";
import { db } from "../lib/db";
import { userTable, vendorTable } from "../lib/db/schema";

export const vendorRoute = express.Router();

type GetVendorData = {
    sessionId: string;
    vendorId: string;
};

vendorRoute.post("/get", async (req, res, next) => {
    const data: GetVendorData = await JSON.parse(req.body);

    const { session } = await lucia.validateSession(data.sessionId);
    if (!session) {
        console.log("no session");
        return new Response(null, {
            status: 400,
        });
    }

    const vendor = await db
        .select()
        .from(vendorTable)
        .where(eq(vendorTable.id, data.vendorId));

    return new Response(JSON.stringify(vendor[0]));
});

vendorRoute.post("/all", async (req, res, next) => {
    const sessionId = await req.body;

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

vendorRoute.post("/numOfUsers", async (req, res, next) => {
    const data: NumOfUsersData = await JSON.parse(req.body);

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

vendorRoute.post("/users", async (req, res, next) => {
    const data: UsersData = await JSON.parse(req.body);

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
