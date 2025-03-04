import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import { TokenType } from '../constants/token-type';

@Injectable()
export class JwtAuthWsGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient();
		const token = this.extractToken(client);

		if (!token) throw new UnauthorizedException('No token found');

		try {
			const payload = this.jwtService.verify(token);

			if (payload.type !== TokenType.ACCESS_TOKEN) {
				throw new UnauthorizedException('Invalid token type');
			}

			const user = await this.usersService.findOne({
				id: payload.userId,
				role: payload.role,
			});

			if (!user) {
				throw new UnauthorizedException();
			}

			client.user = user;
			return true;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}

	private extractToken(client: any) {
		if (client.handshake?.auth?.token) {
			return client.handshake.auth.token;
		}
		if (client.handshake?.query?.token) {
			return client.handshake.query.token;
		}
		if (client.handshake?.headers.authorization?.startsWith('Bearer ')) {
			return client.handshake.headers.authorization.split(' ')[1];
		}
		return null;
	}
}
