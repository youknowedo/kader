import { User } from '@kader/shared';
/// <reference types="vite-plugin-pwa/svelte" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User;
			sessionId?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare module 'virtual:pwa-register' {
	import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

	export type { RegisterSWOptions };

	export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

export interface RegisterSWOptions {
	immediate?: boolean;
	onNeedRefresh?: () => void;
	onOfflineReady?: () => void;
	/**
	 * Called only if `onRegisteredSW` is not provided.
	 *
	 * @deprecated Use `onRegisteredSW` instead.
	 * @param registration The service worker registration if available.
	 */
	onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
	/**
	 * Called once the service worker is registered (requires version `0.12.8+`).
	 *
	 * @param swScriptUrl The service worker script url.
	 * @param registration The service worker registration if available.
	 */
	onRegisteredSW?: (
		swScriptUrl: string,
		registration: ServiceWorkerRegistration | undefined
	) => void;
	onRegisterError?: (error: unknown) => void;
}
