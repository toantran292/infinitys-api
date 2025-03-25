import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { RoleType } from '../constants/role-type';
import { User } from '../modules/users/entities/user.entity';
import { ROLES } from '../decoractors/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<RoleType[] | undefined>(
			ROLES,
			[context.getHandler(), context.getClass()],
		);

		if (!roles?.length) {
			return true;
		}

		const request = context.switchToHttp().getRequest<{ user: User }>();
		const user = request.user;

		return roles.includes(user.role);
	}
}
