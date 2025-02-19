import { type ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { path } = request;

		// Allow signup and signin to bypass authentication
		if (path.includes('/auths/signup') || path.includes('/auths/signin')) {
			return true;
		}

		return super.canActivate(context);
	}

	// handleRequest(err, user, info) {
	// 	if (err || !user) {
	// 		throw new UnauthorizedException('Người dùng chưa xác thực');
	// 	}
	// 	return user;
	// }
}
