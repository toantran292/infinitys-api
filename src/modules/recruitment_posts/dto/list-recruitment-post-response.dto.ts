import { Expose, Type } from 'class-transformer';
import { PageDto } from 'src/common/dto/page.dto';
import { AbstractDto } from 'src/common/dto/abstract.dto';

export class ListRecruitmentPostResponseDto extends AbstractDto {
	@Expose()
	active!: boolean;

	@Expose()
	title!: string;

	@Expose()
	jobPosition: string;

	@Expose()
	location: string;

	@Expose()
	workType: string;

	@Expose()
	jobType: string;

	@Expose()
	description!: string;
}

export class PaginationRecruitmentPostResponseDto extends PageDto {
	@Expose()
	@Type(() => ListRecruitmentPostResponseDto)
	readonly items: ListRecruitmentPostResponseDto[];
}
