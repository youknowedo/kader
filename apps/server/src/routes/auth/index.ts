import { Hono } from "hono";
import { emailRoute } from "./email";
import { githubRoute } from "./github";

export const authRoute = new Hono();

authRoute.route("/email", emailRoute).route("/github", githubRoute);
