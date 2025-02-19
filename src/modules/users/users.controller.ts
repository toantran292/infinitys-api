import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { UsersPageOptionsDto } from './dto/user-page-options.dto';
import type { UserDto } from './dto/user.dto';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@Auth([RoleType.USER])
	async getUsers(
		@Query() pageOptionsDto: UsersPageOptionsDto,
	) {
		return this.usersService.getUsers(pageOptionsDto);
	}

	@Get(':id')
	@Auth([RoleType.USER])
	async getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
		return this.usersService.getUser(userId);
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

	// @Get('profile/:userId')
	// async getUserProfile(@UUIDParam('userId') userId: Uuid) {
	// 	return this.usersService.getUserProfile(userId);
	// }

	// @Put('profile/:userId')
	// async editProfile(
	// 	@UUIDParam('userId') userId: Uuid,
	// 	@Body() updateData: UpdateUserProfileDto,
	// ) {
	// 	return this.usersService.editUserProfile(userId, updateData);
	// }
}
