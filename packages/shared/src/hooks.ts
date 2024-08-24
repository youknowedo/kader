import type { Handle } from "@sveltejs/kit";
import { trpcWithSession } from "./trpc";

export const createSharedHandle =
    (serverUrl: string): Handle =>
    async ({ event, resolve }) => {
        const sessionId = event.cookies.get("auth_session");
        if (!sessionId) {
            (event.locals as any).user = undefined;
            (event.locals as any).sessionId = undefined;
            return resolve(event);
        }

        const { success, error } = await trpcWithSession(
            serverUrl,
            sessionId
        ).session.validate.query();
        if (!success) {
            (event.locals as any).user = undefined;
            (event.locals as any).sessionId = undefined;

            console.log("Unauthenticated");
            console.log(error);
            return resolve(event);
        }

        const { user } = await trpcWithSession(
            serverUrl,
            sessionId
        ).user.getSingle.query();

        (event.locals as any).user = user;
        (event.locals as any).sessionId = sessionId;
        return resolve(event);
    };
