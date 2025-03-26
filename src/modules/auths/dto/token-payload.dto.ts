import { Expose } from 'class-transformer';

import {
	NumberField,
	StringField,
} from '../../../decoractors/field.decoractors';

export class TokenPayloadDto {
	@Expose()
	@NumberField()
	expiresIn!: number;

	@Expose()
	@StringField()
	accessToken: string;
}
