import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const fullWidth = writable((browser && localStorage.getItem('fullWidth')) !== 'false');
fullWidth.subscribe((value) => {
	if (browser) localStorage.setItem('fullWidth', value.toString());
});
