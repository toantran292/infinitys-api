import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { FriendEntity } from '../users/entities/friend.entity';
import { FriendRequestEntity } from '../users/entities/friend-request.entity';

@Module({
	imports: [
		UsersModule,
		TypeOrmModule.forFeature([UserEntity, FriendEntity, FriendRequestEntity]),
	],
	controllers: [SearchController],
	providers: [SearchService],
})
export class SearchModule {}
