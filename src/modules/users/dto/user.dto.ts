import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
	DateFieldOptional,
	EmailField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
} from '../../../decoractors/field.decoractors';
import { UserEntity } from '../entities/user.entity';
import { RoleType } from '../../../constants/role-type';
import { GenderType } from 'src/constants/gender-type';

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

	@DateFieldOptional()
	dateOfBirth?: Date;

	@EnumFieldOptional(() => GenderType)
	gender?: GenderType;

	@StringFieldOptional()
	major?: string;

	@StringFieldOptional()
	desiredJobPosition?: string;

	constructor(user: UserEntity) {
		super(user);
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.email = user.email;
		this.role = user.role;
		this.dateOfBirth = user.dateOfBirth;
		this.gender = user.gender;
		this.major = user.major;
		this.desiredJobPosition = user.desiredJobPosition;
	}
}
