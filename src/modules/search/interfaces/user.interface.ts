export interface UserSearchDocument {
	id: Uuid;
	firstName: string;
	lastName: string;
	email: string;
	avatar?: {
		key: string;
		url?: string;
	};
}
