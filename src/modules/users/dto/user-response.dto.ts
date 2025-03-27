import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { GenderType } from '../../../constants/gender-type';
import { RoleType } from '../../../constants/role-type';
import { FriendStatus } from '../entities/friend.entity';

export class AssetResponseDto {
	@Expose()
	url!: string;
}

export class UserResponseDto extends AbstractDto {
	@Expose()
	firstName!: string;

	@Expose()
	lastName!: string;

	@Expose()
	get fullName() {
		return `${this.firstName} ${this.lastName}`;
	}

	set fullName(value: string) {
		return;
		this.firstName = value?.split(' ')[0];
		this.lastName = value?.split(' ')[1];
	}

	@Expose()
	role!: RoleType;

	@Expose()
	email!: string;

	@Expose()
	dateOfBirth?: Date;

	@Expose()
	gender?: GenderType;

	@Expose()
	major?: string;

	@Expose()
	desiredJobPosition?: string;

	@Expose()
	active!: boolean;

	@Expose()
	@Type(() => AssetResponseDto)
	avatar!: AssetResponseDto;

	@Expose()
	@Type(() => AssetResponseDto)
	banner!: AssetResponseDto;

	@Expose()
	friendStatus?: FriendStatus;

	@Expose()
	totalConnections!: number;
}
