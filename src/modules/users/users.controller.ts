import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Patch,
	Query,
	SerializeOptions,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { FileType } from '../assets/assets.service';
import { CreateAssetDto } from '../assets/dto/create-asset.dto';

import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersPageOptionsDto } from './dto/user-page-options.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { PageResponseDto } from '../pages/dto/page-response.dto';
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
	async getUser(@AuthUser() currentUser: User, @UUIDParam('id') userId: Uuid) {
		const user = await this.usersService.getUser(currentUser, userId);

		return user;
	}

	@SerializeOptions({
		type: UserResponseDto,
	})
	@Patch(':id')
	@Auth([RoleType.USER])
	async updateProfile(
		@AuthUser() user: User,
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
		@AuthUser() user: User,
		@UUIDParam('id') userId: Uuid,
		@Body('avatar') avatar: CreateAssetDto,
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
		@AuthUser() user: User,
		@UUIDParam('id') userId: Uuid,
		@Body('banner') banner: CreateAssetDto,
	) {
		if (userId !== user.id) {
			throw new ForbiddenException('You can only update your own banner');
		}

		return this.usersService.updateAsset(userId, banner, FileType.BANNER);
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Get(':id/working')
	@Auth([RoleType.USER])
	async getWorkingExperience(@UUIDParam('id') userId: Uuid) {
		return this.usersService.getWorkingExperience(userId);
	}
}
