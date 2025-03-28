import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { AuthsModule } from '../auths/auths.module';
import { QueueModule } from '../queues/queue.module';
import { UsersModule } from '../users/users.module';

import { NotificationEntity } from './entities/notifications.entity';
import { SendNotificationsJob } from './jobs/send-notifications.job';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { PagesModule } from '../pages/pages.module';
@Module({
	imports: [
		forwardRef(() => AuthsModule),
		forwardRef(() => UsersModule),
		forwardRef(() => PagesModule),
		AssetsModule,
		TypeOrmModule.forFeature([NotificationEntity]),
		QueueModule,
	],
	providers: [NotificationsService, NotificationsGateway, SendNotificationsJob],
	controllers: [NotificationsController],
	exports: [NotificationsService],
})
export class NotificationsModule {}
