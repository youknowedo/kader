import type { Handle } from "@sveltejs/kit";
import { trpcWithSession } from "./trpc";

export const sharedHandle =
    (handle?: Handle): Handle =>
    async ({ event, resolve }) => {
        if (handle) handle({ event, resolve });

        const sessionId = event.cookies.get("auth_session");
        if (!sessionId) {
            (event.locals as any).user = undefined;
            (event.locals as any).sessionId = undefined;
            return resolve(event);
        }

        const { success, error } =
            await trpcWithSession(sessionId).session.validate.query();
        if (!success) {
            (event.locals as any).user = undefined;
            (event.locals as any).sessionId = undefined;

            console.log("Unauthenticated");
            console.log(error);
            return resolve(event);
        }

        const { user } =
            await trpcWithSession(sessionId).user.getSingle.query();

        (event.locals as any).user = user;
        (event.locals as any).sessionId = sessionId;
        return resolve(event);
    };
