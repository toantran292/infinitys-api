import { createParamDecorator } from '@nestjs/common';

import type { ExecutionContext } from '@nestjs/common';

export function AuthUser() {
	return createParamDecorator((_data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		const user = request.user;

		if (user?.[Symbol.for('isPublic')]) {
			return;
		}

		return user;
	})();
}
