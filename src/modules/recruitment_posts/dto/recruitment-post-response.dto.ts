import { Expose, Type } from 'class-transformer';

import { PageUserDto } from '../../../modules/pages/dto/page-user.dto';

import { ListRecruitmentPostResponseDto } from './list-recruitment-post-response.dto';

export class RecruitmentPostResponseDto extends ListRecruitmentPostResponseDto {
	@Expose()
	@Type(() => PageUserDto)
	pageUser!: PageUserDto;
}
