import { Hono } from "hono";
import { emailRoute } from "./email";
import { validateRoute } from "./validate";

export const authRoute = new Hono();

authRoute.route("/email", emailRoute).route("/validate", validateRoute);
