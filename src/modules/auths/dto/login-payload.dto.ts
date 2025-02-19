import { TokenPayloadDto } from './token-payload.dto';
import { ClassField } from '../../../decoractors/field.decoractors';
import { UserDto } from '../../users/dto/user.dto';

export class LoginPayloadDto {
	@ClassField(() => UserDto)
	user: UserDto;

	@ClassField(() => TokenPayloadDto)
	token: TokenPayloadDto;

	constructor(user: UserDto, token: TokenPayloadDto) {
		this.user = user;
		this.token = token;
	}
}
