import { router } from '../../trpc';
import { queries } from './queries';

export const session = router({ ...queries });
