import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from '../auth/guards/auth.guard';
// import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { AuthWs } from '../../decoractors/ws.decoractors';
import { AuthWsUser } from '../../decoractors/auth-user-ws.decoractors';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	namespace: 'newsfeed',
})
// @UseGuards(WsAuthGuard)
export class NewsfeedGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private userSockets: Map<string, string[]> = new Map();

	async handleConnection(client: Socket) {
		const user = client.data.user as User;
		if (!user) return;

		// Store socket ID for user
		const userSockets = this.userSockets.get(user.id) || [];
		userSockets.push(client.id);
		this.userSockets.set(user.id, userSockets);

		// Join user to their own room
		client.join(user.id);
	}

	handleDisconnect(client: Socket) {
		const user = client.data.user as User;
		if (!user) return;

		// Remove socket ID
		const userSockets = this.userSockets.get(user.id) || [];
		const index = userSockets.indexOf(client.id);
		if (index > -1) {
			userSockets.splice(index, 1);
		}

		if (userSockets.length === 0) {
			this.userSockets.delete(user.id);
		} else {
			this.userSockets.set(user.id, userSockets);
		}
	}

	/**
	 * Thông báo khi có bài viết mới cho user
	 */
	notifyNewPost(userId: string, post: PostEntity) {
		this.server.to(userId).emit('newsfeed:new_post', {
			post,
			author: post.author,
		});
	}

	/**
	 * Subscribe để lắng nghe bài viết mới
	 */
	@SubscribeMessage('newsfeed:subscribe')
	@AuthWs()
	handleSubscribe(@AuthWsUser() user: User) {
		// The client is already joined to their own room on connection
		return { status: 'subscribed' };
	}
}
