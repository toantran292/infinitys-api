import { IsOptional } from 'class-validator';

import {
	EmailField,
	StringField,
	StringFieldOptional,
	URLField,
} from '../../../decoractors/field.decoractors';

export class RegisterPageDto {
	@StringField()
	name!: string;

	@StringFieldOptional()
	content?: string;

	@StringField()
	address!: string;

	@URLField()
	url!: string;

	@EmailField()
	email!: string;

	@IsOptional()
	avatar?: {
		key: string;
		name: string;
		content_type: string;
		size: number;
	};
}
