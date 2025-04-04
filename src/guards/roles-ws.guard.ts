import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES } from '../decoractors/roles.decorator';
import { User } from '../modules/users/entities/user.entity';

import type { RoleType } from '../constants/role-type';
import type { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesWsGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<RoleType[] | undefined>(
			ROLES,
			[context.getHandler(), context.getClass()],
		);

		if (!roles?.length) {
			return true;
		}

		const client = context.switchToWs().getClient<{ user: User }>();
		const user = client.user;

		return roles.includes(user.role);
	}
}
