import { Module } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { AssetEntity } from '../assets/entities/asset.entity';
import { ReactEntity } from '../reacts/entities/react.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../comments/entities/comment.entity';
import { UserEntity } from '../users/entities/user.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AssetsModule } from '../assets/assets.module';
import { ReactsModule } from '../reacts/reacts.module';
@Module({
	imports: [
		TypeOrmModule.forFeature([
			PostEntity,
			ReactEntity,
			CommentEntity,
			UserEntity,
			AssetEntity,
		]),
		AssetsModule,
		ReactsModule,
	],
	controllers: [PostsController],
	providers: [PostsService],
	exports: [PostsService],
})
export class PostsModule { }
