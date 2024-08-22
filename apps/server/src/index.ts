import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { auth } from "./procedures/auth";
import { qr } from "./procedures/qr";
import { user } from "./procedures/user";
import { vendor } from "./procedures/vendor";
import { createContext, router } from "./server";

export const appRouter = router({
    auth,
    qr,
    user,
    vendor,
});

export type AppRouter = typeof appRouter;

const port = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json())
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
