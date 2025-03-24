import { ProblemResponseDto } from './problem-response.dto';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { Expose, Type } from 'class-transformer';
import { PageDto } from 'src/common/dto/page.dto';

export class ListProblemsResponseDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose()
	title: string;
}

export class PaginatedProblemsResponseDto extends PageDto {
	@Expose()
	@Type(() => ProblemResponseDto)
	items: ProblemResponseDto[];
}
