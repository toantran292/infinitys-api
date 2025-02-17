import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RoleType } from '../../constants/role-type';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly configService: ConfigService,
		private readonly userService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key', // Use env variable for security
		});
	}

	async validate(args: {
		userId: string;
		role: RoleType;
	}): Promise<UserEntity>{
		const user = await this.userService.findOne(args.userId, false) as UserEntity;

		if (!user){
			throw new UnauthorizedException();
		}

		return user;
	}
}
