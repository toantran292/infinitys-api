import { Controller, ForbiddenException, Get, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';

@Controller('api/chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) {}

	@Post('groups/recipients/:id')
	@Auth([RoleType.USER])
	async createPrivateGroupChat(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') recipientId: Uuid,
	) {
		if (recipientId === user.id) {
			throw new ForbiddenException(
				'You can not create group chat with yourself',
			);
		}
		return this.chatsService.createPrivateGroupChat(user, recipientId);
	}

	@Get('groups/recipients/:id')
	@Auth([RoleType.USER])
	async getGroupChatWithPerson(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') recipientId: Uuid,
	) {
		return this.chatsService.getGroupChatWithPerson(user, recipientId);
	}

	@Get('groups')
	@Auth([RoleType.USER])
	async getGroupChats(@AuthUser() user: UserEntity) {
		return this.chatsService.getGroupChatsByUserId(user.id);
	}

	// @Get('groups/:id')
	// @Auth([RoleType.USER])
	// async getGroupChat(
	// 	@AuthUser() user: UserEntity,
	// 	@UUIDParam('id') groupChatId: Uuid,
	// ) {
	//
	// }

	@Get('groups/:id/messages')
	@Auth([RoleType.USER])
	async getGroupChatMessages(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') groupChatId: Uuid,
	) {
		return this.chatsService.getGroupChatMessages(user, groupChatId);
	}
}
