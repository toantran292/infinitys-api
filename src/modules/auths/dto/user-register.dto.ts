import {
	EmailField,
	PasswordField,
	StringField,
} from '../../../decoractors/field.decoractors';

export class UserRegisterDto {
	@StringField()
	readonly firstName!: string;

	@StringField()
	readonly lastName!: string;

	@EmailField()
	readonly email!: string;

	@PasswordField({ minLength: 6 })
	readonly password!: string;
}
