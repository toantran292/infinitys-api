import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';

import {
	Problem,
	Submission,
	SubmissionSummary,
	ProblemRecruitmentPost,
} from './entities';
import { ProblemsAdminController } from './problems.admin.controller';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Problem,
			Submission,
			SubmissionSummary,
			ProblemRecruitmentPost,
		]),
		AssetsModule,
	],
	controllers: [ProblemsController, ProblemsAdminController],
	providers: [ProblemsService],
	exports: [ProblemsService],
})
export class ProblemsModule {}
