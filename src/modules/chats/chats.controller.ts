import { Body, Controller, ForbiddenException, Get, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';

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
	async getGroupChats(@AuthUser() user: UserEntity) {
		return this.chatsService.getGroupChatsByUserId(user.id);
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

		return groupChat;
	}

	@Get('groups/:id/messages')
	@Auth([RoleType.USER])
	async getGroupChatMessages(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') groupChatId: Uuid,
	) {
		return this.chatsService.getGroupChatMessages(user, groupChatId);
	}
}
