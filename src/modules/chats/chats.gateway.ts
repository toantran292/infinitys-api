import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthWsUser } from '../../decoractors/auth-user-ws.decoractors';
import { AuthWs } from '../../decoractors/ws.decoractors';
import { User } from '../users/entities/user.entity';

import { ChatsService } from './chats.service';
import { AuthsService } from '../auths/auths.service';
import { PagesService } from '../pages/pages.service';
import { RoleTypePage } from '../../constants/role-type';
/**
 * 1. Khi nhan vao chat -> /api/chats/groups/:id/messages (http) -> load tin nham
 * 2. Connect ws de join vo group -> chat real time (ws)
 * */

@WebSocketGateway({ cors: true, namespace: 'chats' })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(
		private readonly chatsService: ChatsService,
		private readonly authService: AuthsService,
		private readonly pageService: PagesService,
	) {}

	async handleConnection(socket: Socket) {
		try {
			const token = socket.handshake.auth.token as string;
			const userId = socket.handshake.auth.userId as string;
			const user = await this.authService.verifyToken(token);

			const pages = await this.pageService.getWorkingPage(user, {
				role: [RoleTypePage.ADMIN, RoleTypePage.OPERATOR],
			});

			for (const page of pages) {
				socket.join(`page:${page.id}`);
			}

			if (userId) socket.join(`user:${userId}`);
		} catch (error) {
			socket.disconnect();
		}
	}

	handleDisconnect(socket: Socket) {}

	@SubscribeMessage('join_conversation')
	@AuthWs()
	handleJoinConversation(
		@AuthWsUser() user: User,
		@MessageBody() conversationId: Uuid,
		@ConnectedSocket() socket: Socket,
	) {
		socket.join(`conversation:${conversationId}`);
	}

	@SubscribeMessage('send_message')
	@AuthWs()
	async handleSendMessage(
		@AuthWsUser() user: User,
		@MessageBody()
		data: {
			conversationId: Uuid;
			content: string;
			pageId?: Uuid;
		},
	) {
		const message = await this.chatsService.createMessage(
			data.conversationId,
			{ userId: user.id, pageId: data.pageId },
			data.content,
		);

		this.server
			.to(`conversation:${data.conversationId}`)
			.emit('new_message', message);

		const conversation = await this.chatsService.findConversationById(
			data.conversationId,
		);

		const pageChat = conversation.participants.find((p) => p.page)?.page;

		for (const participant of conversation.participants) {
			if (participant.page) {
				this.server
					.to(`page:${participant.page.id}`)
					.emit('conversation_updated', {
						conversationId: conversation.id,
						lastMessage: message,
						updatedAt: conversation.updatedAt,
						participants: conversation.participants,
						pageChatId: pageChat?.id,
					});
			}
			if (participant.user) {
				this.server
					.to(`user:${participant.user.id}`)
					.emit('conversation_updated', {
						conversationId: conversation.id,
						lastMessage: message,
						updatedAt: conversation.updatedAt,
						participants: conversation.participants,
						pageChatId: pageChat?.id,
					});
			}
		}
		await this.chatsService.markAsRead(
			data.conversationId,
			user.id,
			message.id,
		);
	}

	@SubscribeMessage('mark_as_read')
	@AuthWs()
	async handleMarkAsRead(
		@AuthWsUser() user: User,
		@MessageBody()
		data: {
			conversationId: Uuid;
			messageId: Uuid;
		},
	) {
		await this.chatsService.markAsRead(
			data.conversationId,
			user.id,
			data.messageId,
		);
	}

	// @SubscribeMessage('join_room')
	// @AuthWs()
	// async handleJoinRoom(
	// 	@MessageBody() room_id: Uuid,
	// 	@ConnectedSocket() client: Socket,
	// 	@AuthWsUser() user: User,
	// ) {
	// 	const room = await this.chatsService.getGroupChatByIdAndUser(user, room_id);

	// 	if (!room) {
	// 		client.emit('notifications', {
	// 			errors: ['Not found group chat'],
	// 		});
	// 		return;
	// 	}

	// 	client.join(room.id);
	// 	client.emit('joined_room', room);
	// }

	// @SubscribeMessage('send_message')
	// @AuthWs()
	// async handleMessage(
	// 	@MessageBody() sendMessageDto: SendMessageDto,
	// 	@ConnectedSocket() client: Socket,
	// 	@AuthWsUser() user: User,
	// ) {
	// 	try {
	// 		const message = await this.chatsService.sendMessage(
	// 			user,
	// 			sendMessageDto.room_id,
	// 			sendMessageDto.content,
	// 		);

	// 		this.server.to(sendMessageDto.room_id).emit('receive_message', {
	// 			user,
	// 			...message,
	// 		});
	// 	} catch (error) {
	// 		console.error('Error sending message:', error);
	// 	}
	// }
}
