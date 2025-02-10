import { AbstractDto } from '../../../common/dto/abstract.dto';
import { EnumFieldOptional } from '../../../decoractors/field.decoractors';
import { RoleTypePage } from '../../../constants/role-type';
import { PageUserEntity } from '../entities/page-user.entity';

export type PageUserDtoOptions = Partial<{}>;

export class PageUserDto extends AbstractDto {
	@EnumFieldOptional(() => RoleTypePage)
	role?: RoleTypePage;

	constructor(pageUser: PageUserEntity) {
		super(pageUser);
		this.role = pageUser.role;
	}
}
