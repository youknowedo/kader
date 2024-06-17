import { redirect } from '@sveltejs/kit';
import { signUpAction, signUpServerLoad } from '@youknowedo/shared/server';

export const load = signUpServerLoad;

export const actions = {
	default: async (e) => {
		await signUpAction(e);
		redirect(302, '/onboarding');
	}
};
