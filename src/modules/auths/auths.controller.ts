import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserDto } from '../users/dto/user.dto';
import { Auth } from '../../decoractors/http.decorators';

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
			email: userEntity.email,
		});

		return new LoginPayloadDto(userEntity.toDto(), token);
	}

	@Post('register')
	async userRegister(
		@Body() userRegisterDto: UserRegisterDto,
	): Promise<UserDto> {
		const createdUser = await this.usersService.createUser(userRegisterDto);

		return createdUser.toDto<UserDto>();
	}

	@Get('ping')
	@Auth()
	async ping() {
		return 'pong';
	}
}
