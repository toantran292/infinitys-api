import { AbstractDto } from '../../../common/dto/abstract.dto';
import { EnumFieldOptional } from '../../../decoractors/field.decoractors';
import { RoleTypePage } from '../../../constants/role-type';
import { PageUserEntity } from '../entities/page-user.entity';
import { PageDto } from './page.dto';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { PageResponseDto } from './page-response.dto';
export type PageUserDtoOptions = Partial<{}>;

export class PageUserDto extends AbstractDto {
	@Expose()
	@EnumFieldOptional(() => RoleTypePage)
	role?: RoleTypePage;

	@Expose()
	@Type(() => UserResponseDto)
	user?: UserResponseDto;

	@Expose()
	@Type(() => PageResponseDto)
	page?: PageResponseDto;
}
