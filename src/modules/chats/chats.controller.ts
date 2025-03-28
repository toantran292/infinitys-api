import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	SerializeOptions,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { User } from '../users/entities/user.entity';

import { ChatsService } from './chats.service';
import {
	ConversationResponseDto,
	CursorConversationResponseDto,
} from './dto/conversations-response.dto';
import { CursorMessageResponseDto } from './dto/message-response.dto';
@Controller('api/chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) {}

	@SerializeOptions({ type: ConversationResponseDto })
	@Post('conversations/user-page')
	@Auth([RoleType.USER])
	createUserPageConversation(
		@AuthUser() user: User,
		@Body() body: { pageId: Uuid },
	) {
		return this.chatsService.createUserPageConversation(user.id, body.pageId);
	}

	@SerializeOptions({ type: ConversationResponseDto })
	@Post('conversations/group')
	@Auth([RoleType.USER])
	createGroupConversation(
		@AuthUser() user: User,
		@Body() body: { userIds: Uuid[] },
	) {
		const userIds = new Set([...body.userIds, user.id]);
		return this.chatsService.createGroupConversation(Array.from(userIds));
	}

	@SerializeOptions({ type: ConversationResponseDto })
	@Post('conversations/user-user')
	@Auth([RoleType.USER])
	createUserUserConversation(
		@AuthUser() user: User,
		@Body() body: { userId: Uuid },
	) {
		return this.chatsService.createUserUserConversation(user.id, body.userId);
	}

	@Post('message')
	@Auth([RoleType.USER])
	createMessage(
		@AuthUser() user: User,
		@Body()
		body: {
			conversationId: Uuid;
			content: string;
			pageId?: Uuid;
		},
	) {
		return this.chatsService.createMessage(
			body.conversationId,
			{ userId: user.id, pageId: body.pageId },
			body.content,
		);
	}

	@Post('mark-as-read')
	@Auth([RoleType.USER])
	markAsRead(
		@AuthUser() user: User,
		@Body()
		body: {
			conversationId: Uuid;
			messageId: Uuid;
		},
	) {
		return this.chatsService.markAsRead(
			body.conversationId,
			user.id,
			body.messageId,
		);
	}

	@SerializeOptions({ type: CursorConversationResponseDto })
	@Get('conversations')
	@Auth([RoleType.USER])
	getUserConversations(
		@AuthUser() user: User,
		@Query('limit') limit: number = 10,
		@Query('cursor') cursor?: string,
	) {
		return this.chatsService.getUserConversations(
			user.id,
			limit,
			cursor ? new Date(cursor) : undefined,
		);
	}

	@SerializeOptions({ type: ConversationResponseDto })
	@Get('conversations/:id')
	@Auth([RoleType.USER])
	getConversation(@AuthUser() user: User, @UUIDParam('id') id: Uuid) {
		return this.chatsService.getUserConversation(user.id, id);
	}

	@SerializeOptions({ type: ConversationResponseDto })
	@Get('page/:pageId/conversations/:id')
	@Auth([RoleType.USER])
	getPageConversation(
		@AuthUser() user: User,
		@UUIDParam('id') id: Uuid,
		@Query('pageId') pageId: Uuid,
	) {
		return this.chatsService.getPageConversation(pageId, user.id, id);
	}

	@SerializeOptions({ type: CursorConversationResponseDto })
	@Get('page-conversations')
	@Auth([RoleType.USER])
	getPageConversations(
		@AuthUser() user: User,
		@Query('pageId') pageId: Uuid,
		@Query('limit') limit = 10,
		@Query('cursor') cursor?: string,
	) {
		return this.chatsService.getPageConversations(
			pageId,
			user.id,
			limit,
			cursor ? new Date(cursor) : undefined,
		);
	}

	@SerializeOptions({ type: CursorMessageResponseDto })
	@Get('messages')
	@Auth([RoleType.USER])
	getMessages(
		@AuthUser() user: User,
		@Query('pageId') pageId: Uuid | null,
		@Query('conversationId') conversationId: Uuid,
		@Query('limit') limit = 20,
		@Query('cursor') cursor?: string,
	) {
		return this.chatsService.getMessages(
			user.id,
			pageId,
			conversationId,
			limit,
			cursor ? new Date(cursor) : undefined,
		);
	}

	@SerializeOptions({ type: ConversationResponseDto })
	@Get('search')
	@Auth([RoleType.USER])
	async searchGroups(@Query('q') query: string, @AuthUser() currentUser: User) {
		return this.chatsService.getGroupByQuery(query, currentUser.id);
	}

	@SerializeOptions({ type: ConversationResponseDto })
	@Post('conversation/user-ids')
	@Auth([RoleType.USER])
	async getConversationFormUserIds(
		@AuthUser() user: User,
		@Body() body: { userIds: Uuid[] },
	) {
		const userIds = new Set([...body.userIds, user.id]);
		return this.chatsService.getConversationFormUserIds(Array.from(userIds));
	}
}
