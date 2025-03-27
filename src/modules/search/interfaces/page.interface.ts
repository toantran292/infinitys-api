export interface PageSearchDocument {
	id: string;
	name: string;
	content: string;
	address: string;
	url: string;
	email: string;
	avatar?: {
		key: string;
		url?: string;
	};
}
