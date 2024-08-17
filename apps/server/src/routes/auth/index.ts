import { Hono } from "hono";
import { githubRoute } from "./github";

export const authRoute = new Hono();

authRoute.route("/github", githubRoute);
