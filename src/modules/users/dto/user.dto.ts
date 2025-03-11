import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
	BooleanFieldOptional,
	DateFieldOptional,
	EmailField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
} from '../../../decoractors/field.decoractors';
import { UserEntity } from '../entities/user.entity';
import { RoleType } from '../../../constants/role-type';
import { GenderType } from '../../../constants/gender-type';
import { AssetEntity } from '../../assets/entities/asset.entity';
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserAvatarDto extends AbstractDto {
	@StringField()
	url!: string;

	constructor(avatar: AssetEntity) {
		super(avatar)
		this.url = avatar.url;
	}
}

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

	@BooleanFieldOptional()
	active?: boolean;

	avatar?: UserAvatarDto;

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
		this.active = user.active;

		this.avatar = user.avatar ? new UserAvatarDto(user.avatar) : null;
	}
}
