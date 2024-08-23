import { sharedHandle } from '@kader/shared/hooks';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = sharedHandle();
