import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';

@Controller('admin_api/auths')
export class AuthsAdminController {
	constructor(private readonly authsService: AuthsService) {}

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

	@Get('ping')
	async ping() {
		return 'pong';
	}
}
