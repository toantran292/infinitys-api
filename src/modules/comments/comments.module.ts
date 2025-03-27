import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { AuthsModule } from '../auths/auths.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostStatistics } from '../posts/entities/post-statistics.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { ReactEntity } from '../reacts/entities/react.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentStatistics } from './entities/comment-statistics.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
	imports: [
		forwardRef(() => AuthsModule),
		forwardRef(() => UsersModule),
		TypeOrmModule.forFeature([
			CommentEntity,
			PostEntity,
			User,
			PostStatistics,
			CommentStatistics,
			ReactEntity,
		]),
		AssetsModule,
		forwardRef(() => NotificationsModule),
	],
	providers: [CommentsService],
	controllers: [CommentsController],
	exports: [CommentsService],
})
export class CommentsModule {}
