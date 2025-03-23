import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';

@Controller('admin_api/auths')
export class AuthsAdminController {
	constructor(private readonly authsService: AuthsService) {}

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

	@Get('ping')
	async ping() {
		return 'pong';
	}
}
