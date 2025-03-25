import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { RoleType } from 'src/constants/role-type';
import { UnauthorizedException } from '@nestjs/common';
import { Auth } from 'src/decoractors/http.decorators';
import { AuthUser } from 'src/decoractors/auth-user.decorators';
import { User } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('admin_api/auths')
export class AuthsAdminController {
	constructor(private readonly authsService: AuthsService) {}

	@SerializeOptions({ type: LoginPayloadDto })
	@Post('login')
	async userLogin(@Body() userLoginDto: UserLoginDto) {
		const userEntity = await this.authsService.validateUser(userLoginDto);

		if (userEntity.role !== RoleType.ADMIN) {
			throw new UnauthorizedException('error.invalidCredentials');
		}

		const token = await this.authsService.createAccessToken({
			userId: userEntity.id,
			role: userEntity.role,
			email: userEntity.email,
		});

		return { token };
	}

	@SerializeOptions({ type: UserResponseDto })
	@Get('me')
	@Auth([RoleType.ADMIN])
	async me(@AuthUser() user: User) {
		return user;
	}
}
