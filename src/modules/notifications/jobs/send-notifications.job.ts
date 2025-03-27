import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { QueueNames } from '../../queues/queues';
import { UsersService } from '../../users/users.service';
import { NotificationsGateway } from '../notifications.gateway';
import { NotificationData } from '../notifications.service';

@Processor(QueueNames.NOTIFICATION)
export class SendNotificationsJob {
	constructor(
		private readonly notificationGateway: NotificationsGateway,
		// private readonly notificationService: NotificationsService,
		private readonly usersService: UsersService,
	) {}

	@Process('send')
	async handle(job: Job<NotificationData>) {
		const { userId, data } = job.data;

		const { event_name, meta } = data;

		switch (event_name) {
			case 'friend_request:sent':
				await this.handleFriendRequestSent(userId, meta);
				break;
			case 'friend_request:accepted':
				await this.handleFriendRequestAccepted(userId, meta);
				break;
			case 'react:created':
				await this.handleReactCreated(userId, meta);
				break;
			case 'comment:created':
				await this.handleCommentCreated(userId, meta);
				break;
		}
	}

	async handleFriendRequestSent(userId: string, meta: any) {
		const { sourceId } = meta;

		const user = await this.usersService.getUser(null, sourceId);

		this.notificationGateway.sendNotificationToUser(userId, {
			event_name: 'friend_request:received',
			meta: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				avatar: user.avatar?.url,
			},
		});
	}

	async handleFriendRequestAccepted(userId: string, meta: any) {
		const { targetId } = meta;

		const user = await this.usersService.getUser(null, targetId);

		await this.notificationGateway.sendNotificationToUser(userId, {
			event_name: 'friend_request:accepted',
			meta: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				avatar: user.avatar?.url,
			},
		});
	}

	async handleReactCreated(userId: string, meta: any) {
		const { targetId, targetType, reacterId } = meta;

		const user = await this.usersService.getUser(null, reacterId);

		await this.notificationGateway.sendNotificationToUser(userId, {
			event_name: 'react:created',
			meta: {
				reacter: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					fullName: `${user.firstName} ${user.lastName}`,
					avatar: user.avatar?.url,
				},
				target: {
					id: targetId,
					type: targetType,
				},
			},
		});
	}

	async handleCommentCreated(userId: string, meta: any) {
		const { commenterId, content } = meta;

		const user = await this.usersService.getUser(null, commenterId);

		await this.notificationGateway.sendNotificationToUser(userId, {
			event_name: 'comment:created',
			meta: {
				commenter: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					fullName: `${user.firstName} ${user.lastName}`,
					avatar: user.avatar?.url,
				},
				content,
			},
		});
	}
}
