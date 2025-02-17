import {
	NumberField,
	StringField,
} from '../../../decoractors/field.decoractors';

export class TokenPayloadDto {
	@StringField()
	accessToken: string;

	constructor(data: { accessToken: string }) {
		this.accessToken = data.accessToken;
	}
}
