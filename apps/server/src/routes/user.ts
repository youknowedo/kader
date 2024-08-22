import { inArray } from "drizzle-orm";
import express from "express";
import { lucia } from "../lib/auth";
import { db } from "../lib/db";
import { userTable } from "../lib/db/schema";

export const userRoute = express.Router();

type SomeData = {
    sessionId: string;
    users: string[];
};

userRoute.post("/all", async (req, res, next) => {
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

    const users = await db.select().from(userTable);

    return new Response(JSON.stringify(users));
});

userRoute.post("/some", async (req, res, next) => {
    const data: SomeData = await JSON.parse(req.body);

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
