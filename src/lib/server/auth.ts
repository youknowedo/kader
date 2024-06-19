import { SECRET_KEY } from '$env/static/private';
import { usersToKaders } from '$lib/schema';
import { db } from '@youknowedo/shared/server';
import { lib } from 'crypto-js';
import aes from 'crypto-js/aes';
import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';
import { TOTP } from 'otpauth';

export const encrypt = (text: string) => {
	const iv = lib.WordArray.random(16);

	const encrypted = aes.encrypt(text, SECRET_KEY, { iv }).toString();

	return {
		iv: iv.words,
		encryptedData: encrypted
	};
};

export const decrypt = (text: string, iv: number[]) => {
	const decrypted = aes.decrypt(text, SECRET_KEY, { iv: lib.WordArray.create(iv) });

	return decrypted.toString();
};

export const totp = new TOTP({
	secret: SECRET_KEY,
	digits: 6,
	period: 30,
	algorithm: 'sha1'
});

export const accessRole = async (user: User, kaderId: string) => {
	const relation = await db
		.select({
			role: usersToKaders.userRole
		})
		.from(usersToKaders)
		.where(and(eq(usersToKaders.kaderId, kaderId), eq(usersToKaders.userId, user.id)))
		.limit(1);

	if (relation.length === 0) return null;

	return relation[0].role;
};
