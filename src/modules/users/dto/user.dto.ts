import { AbstractDto } from '../../../common/dto/abstract.dto';
import { EmailField, EnumFieldOptional, StringField } from '../../../decoractors/field.decoractors';
import { UserEntity } from '../entities/user.entity';
import { RoleType } from '../../../constants/role-type';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
	@StringField()
	firstName!: string;

	@StringField()
	lastName!: string;

	@EnumFieldOptional(() => RoleType)
	role?: RoleType;

	@EmailField()
	email!: string;

	constructor(user: UserEntity) {
		super(user);
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.email = user.email;
		this.role = user.role;
	}
}
