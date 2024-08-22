import { initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { z } from "zod";
import { auth } from "./procedures/auth";
import { getQr } from "./procedures/qr/queries";
import { updateProfile } from "./procedures/user/mutations";
import { getUsers } from "./procedures/user/queries";
import { getVendor } from "./procedures/vendor/queries";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    return { sessionId: req.headers.authorization };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;

export const appRouter = router({
    auth,
    getQr,
    getUsers,
    getVendor,
    updateProfile,
});

export type AppRouter = typeof appRouter;
