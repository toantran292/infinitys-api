import { Expose, Type } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { PageDto } from 'src/common/dto/page.dto';

export class ListGroupChatMessageResponseDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose()
	@Type(() => UserResponseDto)
	user: UserResponseDto;
}

export class PaginationListGroupChatMessageResponseDto extends PageDto {
	@Expose()
	@Type(() => ListGroupChatMessageResponseDto)
	items!: ListGroupChatMessageResponseDto[];
}
