import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException } from '../../exeptions/user-not-found.exception';
import { validateHash } from '../../common/utils';
import { RoleType } from '../../constants/role-type';
import { TokenType } from '../../constants/token-type';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { UserLoginDto } from './dto/user-login.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

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

	async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
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
}
