import { Session, User } from 'lucia';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: (User & { pfp: string }) | null;
			session: Session | null;
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
	owner: User;
	numOfUsers: number;
};

export { Vendor };
