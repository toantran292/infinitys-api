import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerOrAdminGuard } from '../../guards/ower-or-admin.guard';
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getAllUsers() {
		return this.usersService.findAll();
	}

	@UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
	@Get(':id')
	async getUserById(@Param('id') id: string, @Req() req) {
		return this.usersService.findOne(id, req.isLimitedView);
	}

	@Put(':id/ban')
	async banUser(@Param('id') id: string) {
		return this.usersService.banUser(id);
	}
	@Put(':id/unban')
	async unbanUser(@Param('id') id: string) {
		return this.usersService.unbanUser(id);
	}
	@Delete(':id')
	async deleteUser(@Param('id') id: string) {
		return this.usersService.deleteUser(id);
	}

	@Get('profile/:userId')
	async getUserProfile(@Param('userId') userId: string) {
		return this.usersService.getUserProfile(userId);
	}

	@Put('profile/:userId')
	async editProfile(
		@Param('userId') userId: string,
		@Body() updateData: UpdateUserProfileDto,
	) {
		return this.usersService.editUserProfile(userId, updateData);
	}
}
