import { loginAction, loginServerLoad } from '@youknowedo/shared/server';

export const load = loginServerLoad;

export const actions = {
	default: loginAction
};
