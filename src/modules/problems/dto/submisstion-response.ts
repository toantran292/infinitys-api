import { Expose, Type } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';

export class SubmissionResultDto {
	@Expose()
	testcase: number;

	@Expose()
	status: string;

	@Expose()
	runtime: number;

	@Expose()
	memory: number;
}

export class SubmissionSummaryDto {
	@Expose()
	status: 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';

	@Expose()
	runtime: number;

	@Expose()
	memory: number;

	@Expose()
	totalTestCases: number;

	@Expose()
	passedTestCases: number;

	@Expose()
	@Type(() => SubmissionResultDto)
	failedTestCase?: SubmissionResultDto;
}

export class SubmissionResponseDto extends AbstractDto {
	@Expose()
	code: string;

	@Expose()
	@Type(() => SubmissionResultDto)
	result: SubmissionResultDto[];

	@Expose()
	@Type(() => SubmissionSummaryDto)
	summary: SubmissionSummaryDto;
}

export class SubmissionSummaryResponseDto extends AbstractDto {
	@Expose()
	total!: number;

	@Expose()
	accepted!: number;

	@Expose()
	wrongAnswer!: number;

	@Expose()
	timeLimitExceeded!: number;

	@Expose()
	runtimeError!: number;

	@Expose()
	compilationError!: number;

	@Expose()
	bestRuntime!: number;

	@Expose()
	bestMemory!: number;
}
