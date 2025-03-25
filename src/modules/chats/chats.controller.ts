import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	SerializeOptions,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Auth } from 'src/decoractors/http.decorators';
import { RoleType } from 'src/constants/role-type';
import { User } from '../users/entities/user.entity';
import { AuthUser } from 'src/decoractors/auth-user.decorators';
import { CursorConversationResponseDto } from './dto/conversations-response.dto';
import { CursorMessageResponseDto } from './dto/message-response.dto';
@Controller('api/chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) {}

	@Post('conversations/user-page')
	@Auth([RoleType.USER])
	createUserPageConversation(
		@AuthUser() user: User,
		@Body() body: { pageId: Uuid },
	) {
		return this.chatsService.createUserPageConversation(user.id, body.pageId);
	}

	@Post('conversations/group')
	@Auth([RoleType.USER])
	createGroupConversation(
		@AuthUser() user: User,
		@Body() body: { userIds: Uuid[] },
	) {
		const userIds = new Set([...body.userIds, user.id]);
		return this.chatsService.createGroupConversation(Array.from(userIds));
	}

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

	// @SerializeOptions({ type: GroupChatResponseDto })
	// @Post('groups')
	// @Auth([RoleType.USER])
	// async createGroupChat(
	// 	@AuthUser() admin: User,
	// 	@Body() createGroupChatDto: CreateGroupChatDto,
	// ) {
	// 	return this.chatsService.createGroupChat(admin, createGroupChatDto);
	// }

	// @SerializeOptions({ type: PaginationListGroupChatResponseDto })
	// @Get('groups')
	// @Auth([RoleType.USER])
	// async getGroupChats(
	// 	@AuthUser() user: User,
	// 	@Query() groupsChatOptionsDto: GroupChatPageOptionsDto,
	// ) {
	// 	return this.chatsService.getGroupChatsByUserId(
	// 		user.id,
	// 		groupsChatOptionsDto,
	// 	);
	// }

	// @SerializeOptions({ type: ListGroupChatResponseDto })
	// @Post('groups/search-by-members')
	// @Auth([RoleType.USER])
	// async searchGroupChatsByMembers(
	// 	@AuthUser() user: User,
	// 	@Body() searchGroupChatsByMembersDto: SearchGroupChatsByMembersDto,
	// ) {
	// 	const groupChat = await this.chatsService.searchGroupChatsByExactMembers(
	// 		user.id,
	// 		searchGroupChatsByMembersDto.memberIds,
	// 	);

	// 	if (!groupChat) return {};

	// 	return groupChat;
	// }

	// @SerializeOptions({ type: GroupChatResponseDto })
	// @Get('groups/:id')
	// @Auth([RoleType.USER])
	// async getGroupChat(
	// 	@AuthUser() user: User,
	// 	@UUIDParam('id') groupChatId: Uuid,
	// ) {
	// 	const groupChat = await this.chatsService.getGroupChat(
	// 		user.id,
	// 		groupChatId,
	// 	);

	// 	if (!groupChat)
	// 		throw new ForbiddenException(
	// 			'You not have permission to retrieve message of this group',
	// 		);

	// 	return groupChat;
	// }

	// @SerializeOptions({ type: ListGroupChatMessageResponseDto })
	// @Get('groups/:id/messages')
	// @Auth([RoleType.USER])
	// async getGroupChatMessages(
	// 	@AuthUser() user: User,
	// 	@UUIDParam('id') groupChatId: Uuid,
	// ) {
	// 	const messages = await this.chatsService.getGroupChatMessages(
	// 		user,
	// 		groupChatId,
	// 	);

	// 	return messages;
	// }
}
