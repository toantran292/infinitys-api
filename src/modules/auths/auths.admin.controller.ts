import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('admin_api/auths')
export class AuthsAdminController {
	constructor(private readonly authsService: AuthsService) {}

	@Post('signin')
	async signIn(
		@Body() signInDto: SignInDto,
	): Promise<{ message: string; token: string }> {
		return this.authsService.signIn(signInDto, true);
	}

	@Get('ping')
	@UseGuards(JwtAuthGuard)
	async ping() {
		return 'pong';
	}
}