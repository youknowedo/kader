import { GitHub } from "arctic";
import { env } from "bun";
import { Lucia } from "lucia";
import { adapter } from "./db";

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: env.NODE_ENV === "PRODUCTION", // set `Secure` flag in HTTPS
        },
    },
    getUserAttributes: (attributes) => {
        return {
            email: attributes.email,
            githubId: attributes.github_id,
            username: attributes.username,
        };
    },
});

export const github = new GitHub(
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CLIENT_SECRET!
);

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
            username: string;
            github_id: number;
        };
    }
}
