import { router } from '../../trpc';
import { login } from './login';
import { logout } from './logout';
import { signup } from './signup';

export const auth = router({
	signup,
	login,
	logout
});
