import { lucia } from '../../../../web/src/lib/auth';
import { procedure } from '../../trpc';
import type { ResponseData } from '../../types';

export const logout = procedure.mutation(async ({ ctx, input }): Promise<ResponseData> => {
	if (!ctx.sessionId)
		return {
			success: false,
			error: 'Not logged in'
		};

	await lucia.invalidateSession(ctx.sessionId);

	const sessionCookie = lucia.createBlankSessionCookie();
	ctx.res.setHeader('Set-Cookie', sessionCookie.serialize());

	return {
		success: true
	};
});
