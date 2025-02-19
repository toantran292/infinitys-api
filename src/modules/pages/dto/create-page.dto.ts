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
}
