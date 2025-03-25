import { Module, forwardRef } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { AssetEntity } from '../assets/entities/asset.entity';
import { ReactEntity } from '../reacts/entities/react.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AssetsModule } from '../assets/assets.module';
import { ReactsModule } from '../reacts/reacts.module';
import { PostStatistics } from './entities/post-statistics.entity';

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
		ReactsModule,
	],
	controllers: [PostsController],
	providers: [PostsService],
	exports: [PostsService],
})
export class PostsModule {}
