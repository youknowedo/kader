import { Hono } from "hono";
import { authRoute } from "./routes/auth";
import { idRoute } from "./routes/id";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/auth", authRoute).route("id", idRoute);

export default app;
