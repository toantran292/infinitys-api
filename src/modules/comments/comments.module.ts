import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AuthsModule } from '../auths/auths.module';
import { UsersModule } from '../users/users.module';
import { AssetsModule } from '../assets/assets.module';
import { PostStatistics } from '../posts/entities/post-statistics.entity';

@Module({
	imports: [
		AuthsModule,
		UsersModule,
		TypeOrmModule.forFeature([
			CommentEntity,
			PostEntity,
			UserEntity,
			PostStatistics,
		]),
		AssetsModule,
	],
	providers: [
		CommentsService,
	],
	controllers: [
		CommentsController,
	],
	exports: [
		CommentsService,
	],
})
export class CommentsModule { }
