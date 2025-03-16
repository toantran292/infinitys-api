import { Body, Controller, ForbiddenException, Get, Post, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { GroupChatDto, GroupChatMessageDto, ListGroupChatDto } from './dto/group-chat.dto';
import { GroupChatPageOptionsDto } from './dto/group-chat-page-options-dto';

@Controller('api/chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) { }

	@Post('groups')
	@Auth([RoleType.USER])
	async createGroupChat(
		@AuthUser() admin: UserEntity,
		@Body() createGroupChatDto: CreateGroupChatDto,
	) {
		return this.chatsService.createGroupChat(admin, createGroupChatDto);
	}

	@Get('groups')
	@Auth([RoleType.USER])
	async getGroupChats(@AuthUser() user: UserEntity, @Query() groupsChatOptionsDto: GroupChatPageOptionsDto) {
		const groupChats = await this.chatsService.getGroupChatsByUserId(user.id, groupsChatOptionsDto);

		return groupChats.map((groupChat) => new ListGroupChatDto(groupChat));
	}

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

		if (!groupChat) throw new ForbiddenException(
			'You not have permission to retrieve message of this group',
		);

		return new GroupChatDto(groupChat);
	}

	@Get('groups/:id/messages')
	@Auth([RoleType.USER])
	async getGroupChatMessages(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') groupChatId: Uuid,
	) {
		const messages = await this.chatsService.getGroupChatMessages(user, groupChatId);

		return messages.map((message) => new GroupChatMessageDto(message));
	}
}
