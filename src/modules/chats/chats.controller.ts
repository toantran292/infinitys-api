import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Post,
	Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';

import { GroupChatPageOptionsDto } from './dto/group-chat-page-options-dto';
import { SearchGroupChatsByMembersDto } from './dto/search-group-chats-by-members.dto';
import {
	ListGroupChatResponseDto,
	PaginationListGroupChatResponseDto,
} from './dto/response/list-group-chat-response.dto';
import { SerializeOptions } from '@nestjs/common';
import { GroupChatResponseDto } from './dto/response/group-chat-response.dto';
import { ListGroupChatMessageResponseDto } from './dto/response/list-group-chat-message-response.dto';
@Controller('api/chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) {}

	@SerializeOptions({ type: GroupChatResponseDto })
	@Post('groups')
	@Auth([RoleType.USER])
	async createGroupChat(
		@AuthUser() admin: UserEntity,
		@Body() createGroupChatDto: CreateGroupChatDto,
	) {
		return this.chatsService.createGroupChat(admin, createGroupChatDto);
	}

	@SerializeOptions({ type: PaginationListGroupChatResponseDto })
	@Get('groups')
	@Auth([RoleType.USER])
	async getGroupChats(
		@AuthUser() user: UserEntity,
		@Query() groupsChatOptionsDto: GroupChatPageOptionsDto,
	) {
		return this.chatsService.getGroupChatsByUserId(
			user.id,
			groupsChatOptionsDto,
		);
	}

	@SerializeOptions({ type: ListGroupChatResponseDto })
	@Post('groups/search-by-members')
	@Auth([RoleType.USER])
	async searchGroupChatsByMembers(
		@AuthUser() user: UserEntity,
		@Body() searchGroupChatsByMembersDto: SearchGroupChatsByMembersDto,
	) {
		const groupChat = await this.chatsService.searchGroupChatsByExactMembers(
			user.id,
			searchGroupChatsByMembersDto.memberIds,
		);

		if (!groupChat) return {};

		return groupChat;
	}

	@SerializeOptions({ type: GroupChatResponseDto })
	@Get('groups/:id')
	@Auth([RoleType.USER])
	async getGroupChat(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') groupChatId: Uuid,
	) {
		const groupChat = await this.chatsService.getGroupChat(
			user.id,
			groupChatId,
		);

		if (!groupChat)
			throw new ForbiddenException(
				'You not have permission to retrieve message of this group',
			);

		return groupChat;
	}

	@SerializeOptions({ type: ListGroupChatMessageResponseDto })
	@Get('groups/:id/messages')
	@Auth([RoleType.USER])
	async getGroupChatMessages(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') groupChatId: Uuid,
	) {
		const messages = await this.chatsService.getGroupChatMessages(
			user,
			groupChatId,
		);

		return messages;
	}
}
