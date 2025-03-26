import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { FriendRequestEntity } from '../users/entities/friend-request.entity';
import { FriendEntity } from '../users/entities/friend.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';
@Module({
	imports: [
		UsersModule,
		AssetsModule,
		TypeOrmModule.forFeature([User, FriendEntity, FriendRequestEntity]),
	],
	controllers: [SearchController],
	providers: [SearchService],
})
export class SearchModule {}
