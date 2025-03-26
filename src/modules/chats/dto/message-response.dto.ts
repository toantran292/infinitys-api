import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CursorPageDto } from '../../../common/dto/page.dto';
import { PageResponseDto } from '../../pages/dto/page-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class MessageResponseDto extends AbstractDto {
	@Expose()
	readonly content: string;

	@Expose()
	@Type(() => UserResponseDto)
	readonly senderUser: UserResponseDto;

	@Expose()
	@Type(() => PageResponseDto)
	readonly senderPage: PageResponseDto;
}

export class CursorMessageResponseDto extends CursorPageDto {
	@Expose()
	@Type(() => MessageResponseDto)
	readonly items: MessageResponseDto[];
}
