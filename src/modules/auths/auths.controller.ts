import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';

import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth } from '../../decoractors/http.decorators';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { AuthsService } from './auths.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('api/auths')
export class AuthsController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authsService: AuthsService,
	) {}

	@SerializeOptions({ type: LoginPayloadDto })
	@Post('login')
	async userLogin(@Body() userLoginDto: UserLoginDto) {
		const userEntity = await this.authsService.validateUser(userLoginDto);

		const token = await this.authsService.createAccessToken({
			userId: userEntity.id,
			role: userEntity.role,
			email: userEntity.email,
		});

		return { token };
	}

	@SerializeOptions({ type: LoginPayloadDto })
	@Post('register')
	async userRegister(@Body() userRegisterDto: UserRegisterDto) {
		const createdUser = await this.usersService.createUser(userRegisterDto);

		const token = await this.authsService.createAccessToken({
			userId: createdUser.id,
			role: createdUser.role,
			email: createdUser.email,
		});

		return { token };
	}

	@SerializeOptions({ type: UserResponseDto })
	@Get('me')
	@Auth()
	async me(@AuthUser() user: User) {
		return this.authsService.me(user);
	}
}
