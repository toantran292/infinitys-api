import { createParamDecorator } from '@nestjs/common';

import type { ExecutionContext } from '@nestjs/common';

export function AuthWsUser() {
	return createParamDecorator((_data: unknown, context: ExecutionContext) => {
		const client = context.switchToWs().getClient();

		const user = client.user;

		if (user?.[Symbol.for('isPublic')]) {
			return;
		}

		return user;
	})();
}
