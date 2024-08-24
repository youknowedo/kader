import { appRouter, createContext } from '$lib/api/trpc';
import { sharedHandle } from '@kader/shared/hooks';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = sequence(
	createTRPCHandle({ router: appRouter, createContext }),
	sharedHandle()
);
