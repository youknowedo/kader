import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { appRouter, createContext } from "./server";

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
