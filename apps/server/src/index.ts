import { Hono } from "hono";
import { authRoute } from "./routes/auth";
import { idRoute } from "./routes/id";
import { profileRoute } from "./routes/profile";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/auth", authRoute)
    .route("id", idRoute)
    .route("/profile", profileRoute);

export default app;
