import { AbstractDto } from 'src/common/dto/abstract.dto';
import { Expose, Type } from 'class-transformer';
import { PageDto } from 'src/common/dto/page.dto';

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
}

export class PaginatedProblemsResponseDto extends PageDto {
	@Expose()
	@Type(() => ListProblemsResponseDto)
	items: ListProblemsResponseDto[];
}
