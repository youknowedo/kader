import { signUpAction, signUpServerLoad } from '@youknowedo/shared/server';

export const load = signUpServerLoad;

export const actions = {
	default: signUpAction
};
