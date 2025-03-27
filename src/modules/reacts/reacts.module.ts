import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsModule } from '../comments/comments.module';
import { CommentEntity } from '../comments/entities/comment.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostEntity } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

import { ReactEntity } from './entities/react.entity';
import { ReactsController } from './reacts.controller';
import { ReactsService } from './reacts.services';

@Module({
	imports: [
		TypeOrmModule.forFeature([ReactEntity, PostEntity, User, CommentEntity]),
		forwardRef(() => CommentsModule),
		forwardRef(() => NotificationsModule),
	],
	controllers: [ReactsController],
	providers: [ReactsService],
	exports: [ReactsService],
})
export class ReactsModule {}
