import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { AssetEntity } from '../assets/entities/asset.entity';
import { CommentEntity } from '../comments/entities/comment.entity';
import { ReactEntity } from '../reacts/entities/react.entity';
import { ReactsModule } from '../reacts/reacts.module';
import { User } from '../users/entities/user.entity';

import { PostStatistics } from './entities/post-statistics.entity';
import { PostEntity } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			PostEntity,
			ReactEntity,
			CommentEntity,
			User,
			AssetEntity,
			PostStatistics,
		]),
		AssetsModule,
		forwardRef(() => ReactsModule),
		forwardRef(() => NewsfeedModule),
	],
	controllers: [PostsController],
	providers: [PostsService],
	exports: [PostsService],
})
export class PostsModule {}
