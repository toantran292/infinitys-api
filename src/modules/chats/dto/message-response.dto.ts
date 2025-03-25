import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { CursorPageDto } from 'src/common/dto/page.dto';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { PageResponseDto } from 'src/modules/pages/dto/page-response.dto';

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
