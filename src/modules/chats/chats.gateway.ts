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
import { ChatsService } from './chats.service';
import { AuthsService } from '../auths/auths.service';
import { AuthWs } from '../../decoractors/ws.decoractors';
import { AuthWsUser } from '../../decoractors/auth-user-ws.decoractors';
import { UserEntity } from '../users/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';

/**
 * 1. Khi nhan vao chat -> /api/chats/groups/:id/messages (http) -> load tin nham
 * 2. Connect ws de join vo group -> chat real time (ws)
 * */

@WebSocketGateway({ cors: true })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private users = new Map<string, string>();

	constructor(
		private readonly authService: AuthsService,
		private chatsService: ChatsService,
	) { }

	async handleConnection(client: Socket) {
		try {
			const user = client.handshake.auth.user;
			this.users.set(client.id, user.id);
			this.server.emit('users', Array.from(this.users.values()));
			// console.log(`User ${user.firstName + ' ' + user.lastName} connected`);
		} catch (error) {
			// console.log('Unauthorized connection');
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		// console.log(`Client disconnected: ${client.id}`);
		this.users.delete(client.id);
		this.server.emit('users', Array.from(this.users.values()));
	}

	@SubscribeMessage('join_room')
	@AuthWs()
	async handleJoinRoom(
		@MessageBody() room_id: Uuid,
		@ConnectedSocket() client: Socket,
		@AuthWsUser() user: UserEntity,
	) {
		const room = await this.chatsService.getGroupChatByIdAndUser(user, room_id);

		if (!room) {
			client.emit('notifications', {
				errors: ['Not found group chat'],
			});
			return;
		}

		client.join(room.id);
		client.emit('joined_room', room);
	}

	@SubscribeMessage('send_message')
	@AuthWs()
	async handleMessage(
		@MessageBody() sendMessageDto: SendMessageDto,
		@ConnectedSocket() client: Socket,
		@AuthWsUser() user: UserEntity,
	) {
		try {
			const message = await this.chatsService.sendMessage(
				user,
				sendMessageDto.room_id,
				sendMessageDto.content,
			);

			this.server.to(sendMessageDto.room_id).emit('receive_message', {
				user,
				...message,
			});
		} catch (error) {
			console.error('Error sending message:', error);
		}
	}
}
