import { TokenPayloadDto } from './token-payload.dto';
import { Expose, Transform, Type } from 'class-transformer';

export class LoginPayloadDto {
	@Expose()
	@Type(() => TokenPayloadDto)
	token!: TokenPayloadDto;
}
