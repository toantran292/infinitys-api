import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key', // Use env variable for security
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, email: payload.email };
	}
}
