import type { GetResponseData } from '../../api/totp/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const otp: GetResponseData = await fetch('/api/totp').then((res) => res.json());

	return {
		otp
	};
};
