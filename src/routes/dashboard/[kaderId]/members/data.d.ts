export type User = {
	id: string;
	givenName: string;
	surname: string;
	role: 'owner' | 'admin' | 'member';
	paid: boolean;
	email: string;
};
