import {
	applyDecorators,
	Param,
	ParseUUIDPipe,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';

import { PublicRoute } from './public-route.decorator';
import { Roles } from './roles.decorator';

import type { RoleType } from '../constants/role-type';
import type { PipeTransform } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';

export function Auth(
	roles: RoleType[] = [],
	options?: Partial<{ public: boolean }>,
): MethodDecorator {
	const isPublicRoute = options?.public;

	return applyDecorators(
		Roles(...roles),
		UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
		ApiBearerAuth(),
		UseInterceptors(AuthUserInterceptor),
		ApiUnauthorizedResponse({ description: 'Unauthorized' }),
		PublicRoute(isPublicRoute),
	);
}

export function UUIDParam(
	property: string,
	...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
	return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
