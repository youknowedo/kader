// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: (import('lucia').User & { pfp: string }) | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

type Vendor = {
	id: string;
	name: string;
	description: string;
	owner: string;
};

export { Vendor };
