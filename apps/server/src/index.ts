import { Hono } from "hono";
import { authRoute } from "./routes/auth";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/auth", authRoute);

export default app;
