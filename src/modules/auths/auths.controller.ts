import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auths')
export class AuthsController {
	constructor(private readonly authsService: AuthsService) {}

	@Post('signup')
	async signUp(
		@Body() signUpDto: SignUpDto,
	): Promise<{ message: string; token: string }> {
		return this.authsService.signUp(signUpDto);
	}

	@Post('signin')
	async signIn(
		@Body() signInDto: SignInDto,
	): Promise<{ message: string; token: string }> {
		return this.authsService.signIn(signInDto);
	}

	@Get('ping')
	@UseGuards(JwtAuthGuard)
	async ping() {
		return 'pong';
	}
}
