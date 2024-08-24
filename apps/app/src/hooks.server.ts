import { PUBLIC_SERVER_URL } from '$env/static/public';
import { createSharedHandle } from '@kader/shared/hooks';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = createSharedHandle(PUBLIC_SERVER_URL);
