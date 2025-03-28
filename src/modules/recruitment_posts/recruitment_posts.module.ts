import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationEntity } from '../applications/entities/application.entity';
import { PageUserEntity } from '../pages/entities/page-user.entity';
import { UsersModule } from '../users/users.module';

import { RecruitmentPostEntity } from './entities/recruitment_post.entity';
import { RecruitmentPostsController } from './recruitment_posts.controller';
import { RecruitmentPostsService } from './recruitment_posts.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			RecruitmentPostEntity,
			PageUserEntity,
			ApplicationEntity,
		]),
		forwardRef(() => UsersModule),
	],
	controllers: [RecruitmentPostsController],
	providers: [RecruitmentPostsService],
	exports: [RecruitmentPostsService],
})
export class RecruitmentPostsModule {}
