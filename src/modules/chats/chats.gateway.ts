import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthWsGuard } from '../../guards/jwt-auth-ws.guard';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private users = new Map<string, string>();

	constructor(private jwtService: JwtService) {}

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.auth.token;
			const decoded = this.jwtService.verify(token);
			this.users.set(client.id, decoded.email);
			this.server.emit('users', Array.from(this.users.values())); // Cập nhật danh sách user
			console.log(`User ${decoded.email} connected`);
		} catch (error) {
			console.log('Unauthorized connection');
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.users.delete(client.id);
		this.server.emit('users', Array.from(this.users.values())); // Update user list
	}

	@SubscribeMessage('setUsername')
	handleSetUsername(
		@MessageBody() username: string,
		@ConnectedSocket() client: Socket,
	) {
		this.users.set(client.id, username);
		this.server.emit('users', Array.from(this.users.values())); // Notify all users
	}

	@UseGuards(JwtAuthWsGuard)
	@SubscribeMessage('joinRoom')
	handleJoinRoom(
		@MessageBody() room: string,
		@ConnectedSocket() client: Socket,
	) {
		client.join(room);
		client.emit('joinedRoom', room);
		// lay chat
		client.emit('roomMessages', {
			messages: [{ sender: 'bot', message: 'Welcome to the room' }],
		});
	}

	@UseGuards(JwtAuthWsGuard)
	@SubscribeMessage('message')
	handleMessage(
		@MessageBody()
		{
			room,
			sender,
			message,
		}: { room: string; sender: string; message: string },
		@ConnectedSocket() client: Socket,
	) {
		this.server.to(room).emit('message', { sender, message });
	}
}
