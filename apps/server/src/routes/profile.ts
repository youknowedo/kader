import { Hono } from "hono";

export const profileRoute = new Hono();

profileRoute.get("/picture", async (c) => {
    return new Response();
});
