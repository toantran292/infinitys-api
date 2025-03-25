import { Expose, Type } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { MessageResponseDto } from './message-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { PageResponseDto } from 'src/modules/pages/dto/page-response.dto';
import { CursorPageDto } from 'src/common/dto/page.dto';
class ParticipantResponseDto {
	@Expose()
	@Type(() => UserResponseDto)
	readonly user: UserResponseDto;

	@Expose()
	@Type(() => PageResponseDto)
	readonly page: PageResponseDto;
}

export class ConversationResponseDto extends AbstractDto {
	@Expose()
	readonly createdAt: Date;

	@Expose()
	readonly id: Uuid;

	@Expose()
	readonly isGroup: boolean;

	@Expose()
	readonly isUnread: boolean;

	@Expose()
	@Type(() => MessageResponseDto)
	readonly lastMessage: MessageResponseDto;

	@Expose()
	readonly name: string;

	@Expose()
	@Type(() => ParticipantResponseDto)
	readonly participants: ParticipantResponseDto[];
}

export class CursorConversationResponseDto extends CursorPageDto {
	@Expose()
	@Type(() => ConversationResponseDto)
	readonly items: ConversationResponseDto[];
}
