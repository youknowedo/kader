import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { authRoute } from "./routes/auth";
import { idRoute } from "./routes/id";
import { profileRoute } from "./routes/profile";
import { userRoute } from "./routes/user";
import { vendorRoute } from "./routes/vendor";

export const config = {
    runtime: "edge",
};

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.use(cors())
    .route("/auth", authRoute)
    .route("id", idRoute)
    .route("/profile", profileRoute)
    .route("/vendor", vendorRoute)
    .route("/user", userRoute);

export default handle(app);
