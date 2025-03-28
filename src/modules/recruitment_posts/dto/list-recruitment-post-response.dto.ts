import { Expose, Type, Transform } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { PageUserDto } from '../../pages/dto/page-user.dto';
import { PageResponseDto } from '../../pages/dto/page-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
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

	@Expose()
	@Type(() => PageUserDto)
	pageUser!: PageUserDto;

	@Expose()
	@Transform(({ obj }) => obj.pageUser?.page)
	@Type(() => PageResponseDto)
	page!: PageResponseDto;

	@Expose()
	@Transform(({ obj }) => obj.pageUser?.user)
	@Type(() => UserResponseDto)
	author!: UserResponseDto;
}

export class PaginationRecruitmentPostResponseDto extends PageDto {
	@Expose()
	@Type(() => ListRecruitmentPostResponseDto)
	readonly items: ListRecruitmentPostResponseDto[];
}
