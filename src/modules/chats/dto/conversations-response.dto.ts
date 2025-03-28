import { Expose, Transform, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CursorPageDto } from '../../../common/dto/page.dto';
import { PageResponseDto } from '../../pages/dto/page-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

import { MessageResponseDto } from './message-response.dto';

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
