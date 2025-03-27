import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { QueueNames } from './queues';

@Injectable()
export class QueueService {
	constructor(
		@InjectQueue(QueueNames.NOTIFICATION)
		private readonly notificationQueue: Queue,
	) {}
}
