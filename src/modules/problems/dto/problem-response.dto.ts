import { AbstractDto } from 'src/common/dto/abstract.dto';
import { Expose, Type } from 'class-transformer';
import { AssetResponseDto } from 'src/modules/users/dto/user-response.dto';
import { ListProblemsResponseDto } from './list-problems-response.dto';

export class InOutResponseDto {
	@Expose()
	id: string;

	@Expose()
	url: string;
}

export class TestcaseResponseDto extends AbstractDto {
	@Expose()
	name: string;

	@Expose()
	@Type(() => InOutResponseDto)
	input: InOutResponseDto | null;

	@Expose()
	@Type(() => InOutResponseDto)
	output: InOutResponseDto | null;
}

export class ProblemStatisticsDto {
	@Expose()
	totalSubmissions: number;

	@Expose()
	totalAccepted: number;
}

export class UserProblemStatusDto {
	@Expose()
	attempted: boolean;

	@Expose()
	solved: boolean;

	@Expose()
	submissions: {
		total: number;
		accepted: number;
		wrongAnswer: number;
		timeLimitExceeded: number;
		runtimeError: number;
		compilationError: number;
	};

	@Expose()
	bestSubmission: {
		runtime: number;
		memory: number;
	} | null;
}

export class ProblemResponseDto extends ListProblemsResponseDto {
	@Expose()
	@Type(() => AssetResponseDto)
	images: AssetResponseDto[];

	@Expose()
	@Type(() => TestcaseResponseDto)
	testcases: TestcaseResponseDto[];

	@Expose()
	@Type(() => ProblemStatisticsDto)
	statistics: ProblemStatisticsDto;

	@Expose()
	@Type(() => UserProblemStatusDto)
	userStatus: UserProblemStatusDto | null;
}
