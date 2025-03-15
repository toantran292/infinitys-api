import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Patch,
	Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { UsersPageOptionsDto } from './dto/user-page-options.dto';
import type { UserDto } from './dto/user.dto';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from './entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AvatarDto } from './dto/avatar.dto';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Get()
	@Auth([RoleType.USER])
	async getUsers(@Query() pageOptionsDto: UsersPageOptionsDto) {
		return this.usersService.getUsers(pageOptionsDto);
	}

	@Get(':id')
	@Auth([RoleType.USER])
	async getUser(@UUIDParam('id') userId: Uuid) {
		const user = await this.usersService.getUser(userId);

		return user.toDto<UserDto>();
	}

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

		return this.usersService.updateAvatar(userId, avatar);
	}
}
