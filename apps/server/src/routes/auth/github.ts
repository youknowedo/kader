import { generateState, OAuth2RequestError } from "arctic";
import { env } from "bun";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { generateIdFromEntropySize } from "lucia";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { github, lucia } from "../../auth";
import { db, userTable } from "../../db";

interface GitHubUserResult {
    id: number;
    login: string; // username
    email: string;
}

export const githubRoute = new Hono();

githubRoute.get("/", async (): Promise<Response> => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);
    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
            "Set-Cookie": serializeCookie("github_oauth_state", state, {
                httpOnly: true,
                secure: env.NODE_ENV === "PRODUCTION", // set `Secure` flag in HTTPS
                maxAge: 60 * 10, // 10 minutes
                path: "/",
            }),
        },
    });
});

githubRoute.get("/callback", async ({ req }): Promise<Response> => {
    const cookies = parseCookies(req.header("Cookie") ?? "");
    const stateCookie = cookies.get("github_oauth_state") ?? null;

    const url = new URL(req.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    // verify state
    if (!state || !stateCookie || !code || stateCookie !== state) {
        return new Response(null, {
            status: 400,
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const githubUserResult: GitHubUserResult =
            await githubUserResponse.json();

        const existingUser = (
            await db
                .select()
                .from(userTable)
                .where(eq(userTable.github_id, githubUserResult.id))
                .limit(1)
        )[0];

        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/",
                    "Set-Cookie": sessionCookie.serialize(),
                },
            });
        }

        const userId = generateIdFromEntropySize(10); // 16 characters long
        await db.insert(userTable).values({
            id: userId,
            email: githubUserResult.email,
            username: githubUserResult.login,
            github_id: githubUserResult.id,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
            },
        });
    } catch (e) {
        console.log(e);
        if (e instanceof OAuth2RequestError) {
            // bad verification code, invalid credentials, etc
            return new Response(null, {
                status: 400,
            });
        }
        return new Response(null, {
            status: 500,
        });
    }
});
