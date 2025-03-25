import type { RoleType } from '../constants/role-type';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { PublicRoute } from './public-route.decorator';
import { JwtAuthWsGuard } from '../guards/jwt-auth-ws.guard';
import { RolesWsGuard } from '../guards/roles-ws.guard';

export function AuthWs(
	roles: RoleType[] = [],
	options?: Partial<{ public: boolean }>,
): MethodDecorator {
	const isPublicRoute = options?.public;

	return applyDecorators(
		UseGuards(JwtAuthWsGuard, RolesWsGuard),
		Roles(...roles),
		PublicRoute(isPublicRoute),
	);
}
