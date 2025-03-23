import { Expose, Transform, Type } from 'class-transformer';
import { ListRecruitmentPostResponseDto } from './list-recruitment-post-response.dto';
import { PageUserDto } from 'src/modules/pages/dto/page-user.dto';
import { PageResponseDto } from 'src/modules/pages/dto/page-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class RecruitmentPostResponseDto extends ListRecruitmentPostResponseDto {
	@Expose()
	@Type(() => PageUserDto)
	pageUser!: PageUserDto;
}
