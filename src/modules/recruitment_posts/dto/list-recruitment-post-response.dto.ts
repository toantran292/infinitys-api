import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PageDto } from '../../../common/dto/page.dto';

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
