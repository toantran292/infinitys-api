import { TokenPayloadDto } from './token-payload.dto';
import { ClassField } from '../../../decoractors/field.decoractors';

export class LoginPayloadDto {
	@ClassField(() => TokenPayloadDto)
	token: TokenPayloadDto;

	constructor(token: TokenPayloadDto) {
		this.token = token;
	}
}
