import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { User } from '../modules/users/entities/user.entity';

export const GetUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		return data ? user?.[data] : user;
	},
);
