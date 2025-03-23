import { Transform, Type } from 'class-transformer';
import { PageDto } from 'src/common/dto/page.dto';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { GroupChatMemberResponseDto } from './group-chat-member-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { GroupChatMessageResponseDto } from './group-chat-message-response.dto';

export class ListGroupChatResponseDto extends AbstractDto {
	@Expose()
	name: string;

	@Expose({ toClassOnly: true })
	@Type(() => GroupChatMemberResponseDto)
	groupChatMembers: GroupChatMemberResponseDto[];

	@Expose()
	@Transform(({ obj }) =>
		Array.isArray(obj.groupChatMembers)
			? obj.groupChatMembers.map((member) => member.user)
			: [],
	)
	@Type(() => UserResponseDto)
	members: UserResponseDto[];

	@Expose({ toClassOnly: true })
	@Type(() => GroupChatMessageResponseDto)
	groupChatMessages: GroupChatMessageResponseDto[];

	@Expose()
	@Transform(({ obj }) => {
		console.log({ obj });
		return Array.isArray(obj.groupChatMessages)
			? (obj.groupChatMessages[0] ?? null)
			: null;
	})
	@Type(() => GroupChatMessageResponseDto)
	lastMessage: GroupChatMessageResponseDto;
}

export class PaginationListGroupChatResponseDto extends PageDto {
	@Expose()
	@Type(() => ListGroupChatResponseDto)
	items!: ListGroupChatResponseDto[];
}
