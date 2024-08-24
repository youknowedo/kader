import { router } from '../../trpc';
import { mutations } from './mutations';
import { queries } from './queries';

export const user = router({
	...queries,
	...mutations
});
