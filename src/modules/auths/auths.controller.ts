import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import type { UserLoginDto } from './dto/user-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import type { UserRegisterDto } from './dto/user-register.dto';
import type { UserDto } from '../users/dto/user.dto';

@Controller('api/auths')
export class AuthsController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authsService: AuthsService,
	) {}

	@Post('login')
	async userLogin(
		@Body() userLoginDto: UserLoginDto,
	): Promise<LoginPayloadDto> {
		const userEntity = await this.authsService.validateUser(userLoginDto);

		const token = await this.authsService.createAccessToken({
			userId: userEntity.id,
			role: userEntity.role,
		});

		return new LoginPayloadDto(userEntity.toDto(), token);
	}

	@Post('register')
	async userRegister(
		@Body() userRegisterDto: UserRegisterDto,
	): Promise<UserDto> {
		const createdUser = await this.usersService.createUser(userRegisterDto);

		return createdUser.toDto({
			isActive: true,
		});
	}

	@Get('ping')
	@UseGuards(JwtAuthGuard)
	async ping() {
		return 'pong';
	}
}
