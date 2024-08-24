import { router } from '../../trpc';
import { queries } from './queries';
export const vendor = router({
	...queries
});
