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
            username: attributes.username,
            completed_profile: attributes.completed_profile,
            full_name: attributes.full_name,
            role: attributes.role,
            vendor_id: attributes.vendor_id,
            pfp: null as string | null,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            hex_qr_id: string | null;
            email: string;
            username: string;
            completed_profile: boolean;
            full_name: string | null;
            role: "admin" | "vendor" | "member" | "user";
            vendor_id: string | null;
            pfp: string | null;
        };
    }
}
