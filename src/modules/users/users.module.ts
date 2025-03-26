import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { AssetEntity } from '../assets/entities/asset.entity';
import { NotificationsModule } from '../notifications/notifications.module';

import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendEntity } from './entities/friend.entity';
import { User } from './entities/user.entity';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			FriendEntity,
			FriendRequestEntity,
			AssetEntity,
		]),
		AssetsModule,
		forwardRef(() => NotificationsModule),
	],
	controllers: [UsersController, FriendController],
	providers: [UsersService, FriendService],
	exports: [UsersService, FriendService],
})
export class UsersModule {}
