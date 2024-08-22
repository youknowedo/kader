import { initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { auth } from "./procedures/auth";
import { qr } from "./procedures/qr";
import { user } from "./procedures/user";
import { vendor } from "./procedures/vendor";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    return { sessionId: req.headers.authorization };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;

export const appRouter = router({
    auth,
    qr,
    user,
    vendor,
});

export type AppRouter = typeof appRouter;
