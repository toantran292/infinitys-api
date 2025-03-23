import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ListGroupChatResponseDto } from './list-group-chat-response.dto';

export class GroupChatMemberResponseDto extends AbstractDto {
	@Expose()
	@Type(() => ListGroupChatResponseDto)
	groupChat!: ListGroupChatResponseDto;

	@Expose()
	@Type(() => UserResponseDto)
	user!: UserResponseDto;

	@Expose()
	isAdmin!: boolean;
}
