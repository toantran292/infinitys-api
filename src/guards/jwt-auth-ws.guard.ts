import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthWsGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const client = context.switchToWs().getClient();
		const token = client.handshake.auth.token;

		try {
			const decoded = this.jwtService.verify(token);
			client.user = decoded; // Gắn user vào client để sử dụng sau này
			return true;
		} catch (error) {
			console.log('JWT Authentication failed');
			return false;
		}
	}
}
