import type {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import {UserEntity} from "../modules/users/entities/user.entity";
import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest<{ user: UserEntity }>();

        const user = request.user;
        ContextProvider.setAuthUser(user);

        return next.handle();
    }
}
