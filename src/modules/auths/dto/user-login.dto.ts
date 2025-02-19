import {
	EmailField,
	StringField,
} from '../../../decoractors/field.decoractors';

export class UserLoginDto {
	@EmailField()
	readonly email!: string;

	@StringField()
	readonly password!: string;
}
