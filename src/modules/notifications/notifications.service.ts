import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';

import { QueueNames } from '../queues/queues';

import { NotificationEntity } from './entities/notifications.entity';

export interface NotificationData {
	userId: string;
	data: any;
}

@Injectable()
export class NotificationsService {
	constructor(
		@InjectQueue(QueueNames.NOTIFICATION)
		private readonly notificationQueue: Queue,
		@InjectRepository(NotificationEntity)
		private readonly notificationRepository: Repository<NotificationEntity>,
	) {}

	async sendNotificationToUser(notificationData: NotificationData) {
		// await this.notificationRepository.save(notification);
		await this.notificationQueue.add('send', notificationData, {
			attempts: 3,
		});
	}
}
