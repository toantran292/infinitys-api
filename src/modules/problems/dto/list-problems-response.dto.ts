import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PageDto } from '../../../common/dto/page.dto';

import { TestcaseResponseDto } from './testcase-response.dto';
export class AdminListProblemsResponseDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose()
	title: string;

	@Expose()
	totalTestcases: number;
}

export class ProblemStatisticsDto {
	@Expose()
	totalSubmissions: number;

	@Expose()
	totalAccepted: number;
}

export class UserSubmissionStatsDto {
	@Expose()
	total: number;

	@Expose()
	accepted: number;

	@Expose()
	wrongAnswer: number;

	@Expose()
	timeLimitExceeded: number;

	@Expose()
	runtimeError: number;

	@Expose()
	compilationError: number;
}

export class BestSubmissionDto {
	@Expose()
	runtime: number;

	@Expose()
	memory: number;
}

export class UserProblemStatusDto {
	@Expose()
	attempted: boolean;

	@Expose()
	solved: boolean;

	@Expose()
	@Type(() => UserSubmissionStatsDto)
	submissions: UserSubmissionStatsDto;

	@Expose()
	@Type(() => BestSubmissionDto)
	bestSubmission: BestSubmissionDto | null;
}

export class ListProblemsResponseDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose()
	title: string;

	@Expose()
	difficulty: string;

	@Expose()
	timeLimit: number;

	@Expose()
	memoryLimit: number;

	@Expose()
	examples: object;

	@Expose()
	constraints: object;

	@Expose()
	@Type(() => ProblemStatisticsDto)
	statistics: ProblemStatisticsDto;

	@Expose()
	@Type(() => UserProblemStatusDto)
	userStatus: UserProblemStatusDto | null;
}

export class AdminPaginatedProblemsResponseDto extends PageDto {
	@Expose()
	@Type(() => AdminListProblemsResponseDto)
	items: AdminListProblemsResponseDto[];
}

export class PaginatedProblemsResponseDto extends PageDto {
	@Expose()
	@Type(() => ListProblemsResponseDto)
	items: ListProblemsResponseDto[];
}
