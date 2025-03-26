import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { RecruitmentPostResponseDto } from '../../recruitment_posts/dto/recruitment-post-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ListApplicationResponseDto extends AbstractDto {
	@Expose()
	@Type(() => UserResponseDto)
	user!: UserResponseDto;

	@Expose()
	@Type(() => RecruitmentPostResponseDto)
	recruitmentPost!: RecruitmentPostResponseDto;
}

export class PaginationApplicationResponseDto extends PageDto {
	@Expose()
	@Type(() => ListApplicationResponseDto)
	items!: ListApplicationResponseDto[];
}
