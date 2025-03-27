import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsfeedService } from './newsfeed.service';
import { NewsfeedItem } from './entities/newsfeed-item.entity';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { AssetsModule } from '../assets/assets.module';
import { NewsfeedGateway } from './newsfeed.gateway';
import { SharedModule } from '../../shared/shared.module';
import { NewsfeedScheduler } from './newsfeed.scheduler';
import { NewsfeedController } from './newsfeed.controller';
import { AuthsModule } from '../auths/auths.module';
import { PostEntity } from '../posts/entities/post.entity';

@Module({
	imports: [
		// SharedModule,
		TypeOrmModule.forFeature([NewsfeedItem, PostEntity]),
		forwardRef(() => PostsModule),
		forwardRef(() => UsersModule),
		forwardRef(() => AssetsModule),
		forwardRef(() => AuthsModule),
	],
	providers: [NewsfeedService, NewsfeedGateway, NewsfeedScheduler],
	exports: [NewsfeedService],
	controllers: [NewsfeedController],
})
export class NewsfeedModule {}
