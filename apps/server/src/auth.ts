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
            hex_qr_id: attributes.hex_qr_id,
            github_id: attributes.github_id,
            username: attributes.username,
            completed_profile: attributes.completed_profile,
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
            hex_qr_id: string;
            email: string;
            username: string;
            github_id: number;
            completed_profile: boolean;
        };
    }
}
