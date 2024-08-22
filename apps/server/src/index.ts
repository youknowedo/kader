import cookieParser from "cookie-parser";
import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { authRoute } from "./routes/auth";
import { idRoute } from "./routes/id";
import { profileRoute } from "./routes/profile";
import { userRoute } from "./routes/user";
import { vendorRoute } from "./routes/vendor";

const app: Express = express();

app.use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use("/auth", authRoute)
    .use("id", idRoute)
    .use("/profile", profileRoute)
    .use("/vendor", vendorRoute)
    .use("/user", userRoute);

const port = process.env.PORT || 3000;

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
