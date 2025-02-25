import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FriendEntity } from './entities/friend.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, FriendEntity, FriendRequestEntity]),
	],
	controllers: [UsersController, FriendController],
	providers: [UsersService, FriendService],
	exports: [UsersService, FriendService],
})
export class UsersModule {}
