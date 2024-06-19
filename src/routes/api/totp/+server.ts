import { decrypt, encrypt, totp } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export type GetResponseData = {
	iv: string;
	data: string;
	secondsLeft: number;
};
export type EncryptedData = {
	userId: string;
	otp: string;
};

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return new Response(null, { status: 401 });

	const otp = totp.generate();
	const secondsLeft = totp.period - (Math.floor(Date.now() / 1000) % totp.period);

	const data: EncryptedData = {
		userId: locals.user.id,
		otp
	};
	const { iv, encryptedData } = encrypt(JSON.stringify(data));

	const body: GetResponseData = {
		iv,
		data: encryptedData,
		secondsLeft
	};
	return new Response(JSON.stringify(body));
};

export type PostRequestData = {
	iv: string;
	data: string;
};
export const POST: RequestHandler = async ({ request }) => {
	const data: PostRequestData = await request.json();
	const decryptedData = decrypt(data.data, data.iv);

	const { userId, otp }: EncryptedData = JSON.parse(decryptedData);

	return new Response(
		JSON.stringify({
			body: {
				userId,
				otp
			}
		})
	);
};
