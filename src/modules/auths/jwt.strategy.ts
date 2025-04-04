import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RoleType } from '../../constants/role-type';
import { TokenType } from '../../constants/token-type';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly configService: ApiConfigService,
		private readonly userService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.authConfig.publicKey,
		});
	}

	async validate(args: {
		userId: Uuid;
		role: RoleType;
		type: TokenType;
	}): Promise<User> {
		if (args.type !== TokenType.ACCESS_TOKEN) {
			throw new UnauthorizedException();
		}

		const user = await this.userService.getUser(null, args.userId, {
			role: args.role,
		});

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
