import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { FriendEntity } from '../users/entities/friend.entity';
import { FriendRequestEntity } from '../users/entities/friend-request.entity';
import { AssetsModule } from '../assets/assets.module';
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
