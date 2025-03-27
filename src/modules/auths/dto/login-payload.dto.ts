import { Expose, Type } from 'class-transformer';

import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
	@Expose()
	@Type(() => TokenPayloadDto)
	token!: TokenPayloadDto;
}
