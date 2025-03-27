import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	SerializeOptions,
} from '@nestjs/common';

import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { User } from '../users/entities/user.entity';

import { PaginatedProblemsResponseDto } from './dto/list-problems-response.dto';
import { ProblemPageOptionDto } from './dto/problem-page-option';
import { ProblemResponseDto } from './dto/problem-response.dto';
import {
	SubmissionResponseDto,
	SubmissionSummaryResponseDto,
} from './dto/submisstion-response';
import { SubmitProblemDto } from './dto/submit-problem.dto';
import { ProblemsService } from './problems.service';
@Controller('api/problems')
export class ProblemsController {
	constructor(private readonly problemsService: ProblemsService) {}

	@SerializeOptions({
		type: PaginatedProblemsResponseDto,
	})
	@Get()
	@Auth()
	async getProblems(
		@Query() pageOptionsDto: ProblemPageOptionDto,
		@AuthUser() user: User,
	) {
		return this.problemsService.getProblems(pageOptionsDto, false, user.id);
	}

	@SerializeOptions({
		type: ProblemResponseDto,
	})
	@Get(':id')
	async getProblem(@UUIDParam('id') id: Uuid) {
		return this.problemsService.getProblem(id, true);
	}

	@Post(':id/submit')
	@Auth()
	async submitProblem(
		@AuthUser() user: User,
		@UUIDParam('id') id: Uuid,
		@Body() body: SubmitProblemDto,
	) {
		return this.problemsService.submitProblem(user.id, id, body);
	}

	@SerializeOptions({
		type: SubmissionResponseDto,
	})
	@Get(':id/submissions')
	@Auth()
	async getSubmissions(@UUIDParam('id') id: Uuid, @AuthUser() user: User) {
		return this.problemsService.getSubmissions(id, user.id);
	}

	@SerializeOptions({
		type: SubmissionSummaryResponseDto,
	})
	@Get(':id/submissions/summary')
	@Auth()
	async getSubmissionSummary(
		@UUIDParam('id') id: Uuid,
		@AuthUser() user: User,
	) {
		return this.problemsService.getSubmissionSummary(id, user.id);
	}
}
