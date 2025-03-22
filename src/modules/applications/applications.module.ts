import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationEntity } from './entities/application.entity';
import { RecruitmentPostEntity } from '../recruitment_posts/entities/recruitment_post.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ApplicationEntity, RecruitmentPostEntity]),
	],
	controllers: [ApplicationsController],
	providers: [ApplicationsService],
	exports: [ApplicationsService],
})
export class ApplicationsModule {}
