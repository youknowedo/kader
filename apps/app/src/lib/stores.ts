import type { User } from '@kader/shared';
import { writable } from 'svelte/store';

export const user = writable<User | null | undefined>(undefined);
