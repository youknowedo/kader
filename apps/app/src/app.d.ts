import { User } from 'lucia';

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

type Vendor = {
	id: string;
	name: string;
	description: string | null;
	owner: Omit<User, 'pfp'>;
	numOfUsers: number;
};

export { Vendor };
