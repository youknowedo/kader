import type { User } from '@kader/shared';
import { eq } from 'drizzle-orm';
import * as OTPAuth from 'otpauth';
import { z } from 'zod';
import { lucia } from '../../../../web/src/lib/auth';
import { db } from '../../../../web/src/lib/db';
import { userTable } from '../../../../web/src/lib/db/schema';
import { minio } from '../../../../web/src/lib/storage';
import { procedure } from '../../trpc';
import type { ResponseData } from '../../types';

export const mutations = {
	verify: procedure
		.input(
			z.object({
				userId: z.string(),
				token: z.string()
			})
		)
		.mutation(async ({ ctx, input }): Promise<ResponseData<{ user: User }>> => {
			if (!ctx.sessionId)
				return {
					success: false,
					error: 'Unauthenticated'
				};

			const { session, user: currentUser } = await lucia.validateSession(ctx.sessionId);
			if (!session)
				return {
					success: false,
					error: 'Unauthenticated'
				};

			if (currentUser.role !== 'admin' && currentUser.role !== 'vendor')
				return {
					success: false,
					error: 'Unauthorized'
				};

			const user = (await db.select().from(userTable).where(eq(userTable.id, input.userId)))[0];
			const hex_qr_id = user?.hex_qr_id;

			if (!user || !hex_qr_id)
				return {
					success: false,
					error: 'User not found'
				};

			let secret = new OTPAuth.Secret({
				buffer: Uint8Array.from(Buffer.from(hex_qr_id, 'hex')).buffer
			});
			const totp = new OTPAuth.TOTP({
				algorithm: 'SHA1',
				digits: 6,
				period: 30,
				secret
			});

			if (!totp.validate({ token: input.token, window: 2 }))
				return {
					success: false,
					error: 'Invalid token'
				};

			const pfp = await minio.presignedGetObject(process.env.MINIO_BUCKET!, user.id + '.webp');

			return {
				success: true,
				user: {
					...user,
					pfp
				}
			};
		})
};
