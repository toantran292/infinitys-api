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

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@Auth([RoleType.USER])
	async getUsers(@Query() pageOptionsDto: UsersPageOptionsDto) {
		return this.usersService.getUsers(pageOptionsDto);
	}

	@Get(':id')
	@Auth([RoleType.USER])
	async getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
		return this.usersService.getUser(userId);
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

	// @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
	// @Get(':id')
	// async getUserById(@Param('id') id: string, @Req() req) {
	// 	return this.usersService.findOne(id, req.isLimitedView);
	// }

	// @Put(':id/ban')
	// async banUser(@Param('id') id: string) {
	// 	return this.usersService.banUser(id);
	// }
	// @Put(':id/unban')
	// async unbanUser(@Param('id') id: string) {
	// 	return this.usersService.unbanUser(id);
	// }
}
