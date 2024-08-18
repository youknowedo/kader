import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoute } from "./routes/auth";
import { idRoute } from "./routes/id";
import { profileRoute } from "./routes/profile";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.use(cors())
    .route("/auth", authRoute)
    .route("id", idRoute)
    .route("/profile", profileRoute);

export default app;
