import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { AuthsModule } from '../auths/auths.module';
import { AssetsModule } from '../assets/assets.module';
import { UsersModule } from '../users/users.module';
import { NotificationEntity } from './entities/notifications.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '../queues/queue.module';
import { SendNotificationsJob } from './jobs/send-notifications.job';

@Module({
	imports: [
		forwardRef(() => AuthsModule),
		forwardRef(() => UsersModule),
		AssetsModule,
		TypeOrmModule.forFeature([NotificationEntity]),
		QueueModule,
	],
	providers: [NotificationsService, NotificationsGateway, SendNotificationsJob],
	controllers: [NotificationsController],
	exports: [NotificationsService],
})
export class NotificationsModule {}
