import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { FriendEntity } from './entities/friend.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { AssetsModule } from '../assets/assets.module';
import { AssetEntity } from '../assets/entities/asset.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			FriendEntity,
			FriendRequestEntity,
			AssetEntity,
		]),
		AssetsModule,
	],
	controllers: [UsersController, FriendController],
	providers: [UsersService, FriendService],
	exports: [UsersService, FriendService],
})
export class UsersModule {}
