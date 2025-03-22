import { AbstractDto } from '../../../common/dto/abstract.dto';
import { EnumFieldOptional } from '../../../decoractors/field.decoractors';
import { RoleTypePage } from '../../../constants/role-type';
import { PageUserEntity } from '../entities/page-user.entity';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { PageDto } from './page.dto';

export type PageUserDtoOptions = Partial<{}>;

export class PageUserDto extends AbstractDto {
	@EnumFieldOptional(() => RoleTypePage)
	role?: RoleTypePage;

	user?: UserDto;
	page?: PageDto;

	constructor(pageUser: PageUserEntity) {
		super(pageUser);
		this.role = pageUser.role;
		this.user = pageUser.user?.toDto<UserDto>();
		this.page = pageUser.page?.toDto<PageDto>();
	}
}
