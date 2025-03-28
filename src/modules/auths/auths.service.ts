import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';
import { RoleType } from '../../constants/role-type';
import { TokenType } from '../../constants/token-type';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import type { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthsService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ApiConfigService,
		private readonly userService: UsersService,
	) {}

	async createAccessToken(data: {
		role: RoleType;
		userId: Uuid;
		email: string;
	}) {
		return {
			expiresIn: this.configService.authConfig.jwtExpirationTime,
			accessToken: await this.jwtService.signAsync({
				userId: data.userId,
				type: TokenType.ACCESS_TOKEN,
				role: data.role,
				email: data.email,
			}),
		};
	}

	async validateUser(userLoginDto: UserLoginDto): Promise<User> {
		const user = await this.userService.findOne({
			email: userLoginDto.email,
		});

		const isPasswordValid = await validateHash(
			userLoginDto.password,
			user?.password,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException('error.invalidCredentials');
		}

		return user!;
	}

	async verifyToken(token: string): Promise<User> {
		const decoded = this.jwtService.verify(token);
		if (decoded.type !== TokenType.ACCESS_TOKEN) {
			throw new UnauthorizedException();
		}

		return this.userService.findOne({ id: decoded.userId });
	}
}
