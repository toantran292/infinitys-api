import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { AuthsModule } from '../auths/auths.module';
import { UsersModule } from '../users/users.module';
import { AssetsModule } from '../assets/assets.module';
import { PostStatistics } from '../posts/entities/post-statistics.entity';
import { CommentStatistics } from './entities/comment-statistics.entity';
import { ReactEntity } from '../reacts/entities/react.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
	imports: [
		AuthsModule,
		UsersModule,
		TypeOrmModule.forFeature([
			CommentEntity,
			PostEntity,
			User,
			PostStatistics,
			CommentStatistics,
			ReactEntity,
		]),
		AssetsModule,
		NotificationsModule,
	],
	providers: [CommentsService],
	controllers: [CommentsController],
	exports: [CommentsService],
})
export class CommentsModule {}
