import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ApplicationEntity } from '../entities/application.entity';
import { PageDto } from 'src/common/dto/page.dto';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { RecruitmentPostResponseDto } from 'src/modules/recruitment_posts/dto/recruitment-post-response.dto';

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
