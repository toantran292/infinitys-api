import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // Use env variable for security
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, email: payload.email };
	}
}
