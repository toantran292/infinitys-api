import { AbstractDto } from '../../../common/dto/abstract.dto';
import { GenderType } from '../../../constants/gender-type';
import { RoleType } from '../../../constants/role-type';
import {
	BooleanFieldOptional,
	DateFieldOptional,
	EmailField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
} from '../../../decoractors/field.decoractors';
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserAvatarDto extends AbstractDto {
	@StringField()
	url!: string;

	// constructor(avatar: AssetEntity) {
	// 	super(avatar);
	// 	this.url = avatar.url;
	// }
}

export class BaseUserDto extends AbstractDto {
	@StringField()
	firstName!: string;

	@StringField()
	lastName!: string;

	@StringField()
	fullName!: string;

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

	@BooleanFieldOptional()
	active?: boolean;

	// constructor(user: UserEntity) {
	// 	super(	user);
	// 	this.firstName = user.firstName;
	// 	this.lastName = user.lastName;
	// 	this.fullName = `${user.firstName} ${user.lastName}`;
	// 	this.email = user.email;
	// 	this.role = user.role;
	// 	this.dateOfBirth = user.dateOfBirth;
	// 	this.gender = user.gender;
	// 	this.major = user.major;
	// 	this.desiredJobPosition = user.desiredJobPosition;
	// 	this.active = user.active;
	// }
}

export class UserDto extends BaseUserDto {
	avatar?: UserAvatarDto;

	// constructor(user: UserEntity) {
	// 	super(user);
	// 	this.avatar = user.avatar ? new UserAvatarDto(user.avatar[0]) : null;
	// }
}
