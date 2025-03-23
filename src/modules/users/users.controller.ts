import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Patch,
	Query,
	SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { UsersPageOptionsDto } from './dto/user-page-options.dto';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from './entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AvatarDto, BannerDto } from './dto/avatar.dto';
import { FileType } from '../assets/assets.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@Auth([RoleType.USER])
	async getUsers(@Query() pageOptionsDto: UsersPageOptionsDto) {
		return this.usersService.getUsers(pageOptionsDto);
	}

	@SerializeOptions({
		type: UserResponseDto,
	})
	@Get(':id')
	@Auth([RoleType.USER])
	async getUser(@UUIDParam('id') userId: Uuid) {
		const user = await this.usersService.getUser(userId);

		return user;
	}

	@SerializeOptions({
		type: UserResponseDto,
	})
	@Patch(':id')
	@Auth([RoleType.USER])
	async updateProfile(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') userId: Uuid,
		@Body() updateProfileDto: UpdateUserProfileDto,
	) {
		if (userId !== user.id) {
			throw new ForbiddenException('You can only update your own profile');
		}

		return this.usersService.editUserProfile(user, updateProfileDto);
	}

	@SerializeOptions({
		type: UserResponseDto,
	})
	@Patch(':id/avatar')
	@Auth([RoleType.USER])
	async updateAvatar(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') userId: Uuid,
		@Body('avatar') avatar: AvatarDto,
	) {
		if (userId !== user.id) {
			throw new ForbiddenException('You can only update your own avatar');
		}

		return this.usersService.updateAsset(userId, avatar, FileType.AVATAR);
	}

	@SerializeOptions({
		type: UserResponseDto,
	})
	@Patch(':id/banner')
	@Auth([RoleType.USER])
	async updateBanner(
		@AuthUser() user: UserEntity,
		@UUIDParam('id') userId: Uuid,
		@Body('banner') banner: BannerDto,
	) {
		if (userId !== user.id) {
			throw new ForbiddenException('You can only update your own banner');
		}

		return this.usersService.updateAsset(userId, banner, FileType.BANNER);
	}
}
