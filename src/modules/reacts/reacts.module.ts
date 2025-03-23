import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactEntity } from './entities/react.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ReactsController } from './reacts.controller';
import { ReactsService } from './reacts.services';
import { CommentsModule } from '../comments/comments.module';
import { PostsModule } from '../posts/posts.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CommentEntity } from '../comments/entities/comment.entity';
@Module({
	imports: [
		TypeOrmModule.forFeature([
			ReactEntity,
			PostEntity,
			UserEntity,
			CommentEntity,
		]),
		CommentsModule,
		NotificationsModule,
	],
	controllers: [ReactsController],
	providers: [ReactsService],
	exports: [ReactsService],
})
export class ReactsModule {}
