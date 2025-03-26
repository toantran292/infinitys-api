import { Injectable } from '@nestjs/common';

import { User } from '../modules/users/entities/user.entity';
import { ContextProvider } from '../providers/context.provider';

import type {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest<{ user: User }>();

		const user = request.user;
		ContextProvider.setAuthUser(user);

		return next.handle();
	}
}
