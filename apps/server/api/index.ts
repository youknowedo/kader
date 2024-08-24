import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { auth } from "../src/procedures/auth";
import { qr } from "../src/procedures/qr";
import { session } from "../src/procedures/session";
import { user } from "../src/procedures/user";
import { vendor } from "../src/procedures/vendor";
import { createContext, router } from "../src/server";

export const appRouter = router({
    auth,
    qr,
    user,
    vendor,
    session,
});

export type AppRouter = typeof appRouter;

const port = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json())
    .use(
        cors({
            origin(requestOrigin, callback) {
                const allowedOrigins = [
                    process.env.APP_URL,
                    process.env.WEB_URL,
                ];
                if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            },
            credentials: true,
        })
    )
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(
        "/trpc",
        createExpressMiddleware({
            router: appRouter,
            createContext,
        })
    );

app.get(
    "/",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json({
                message: "Hurray!! we create our first server on bun js",
                success: true,
            });
        } catch (error: unknown) {
            next(new Error((error as Error).message));
        }
    }
);

app.listen(port, () => {
    console.log(`Server is up and running on port http://localhost:${port}`);
});

export default app;
