import { initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { z } from "zod";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    return { sessionId: req.headers.authorization };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;

export const appRouter = t.router({
    getUser: t.procedure.input(z.string()).query((opts) => {
        opts.input;
        return { id: opts.input, name: "Bilbo" };
    }),
});

export type AppRouter = typeof appRouter;
