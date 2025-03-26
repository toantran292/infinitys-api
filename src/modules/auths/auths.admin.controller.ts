import {
	Body,
	Controller,
	Get,
	Post,
	SerializeOptions,
	UnauthorizedException,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth } from '../../decoractors/http.decorators';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { User } from '../users/entities/user.entity';

import { AuthsService } from './auths.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';

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
