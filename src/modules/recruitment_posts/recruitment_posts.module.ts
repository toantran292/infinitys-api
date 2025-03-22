import { Module } from '@nestjs/common';
import { RecruitmentPostsController } from './recruitment_posts.controller';
import { RecruitmentPostsService } from './recruitment_posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentPostEntity } from './entities/recruitment_post.entity';
import { UsersModule } from '../users/users.module';
import { PageUserEntity } from '../pages/entities/page-user.entity';
import { ApplicationEntity } from '../applications/entities/application.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			RecruitmentPostEntity,
			PageUserEntity,
			ApplicationEntity,
		]),
		UsersModule,
	],
	controllers: [RecruitmentPostsController],
	providers: [RecruitmentPostsService],
})
export class RecruitmentPostsModule {}
