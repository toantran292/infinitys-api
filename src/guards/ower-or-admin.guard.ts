import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleType } from '../constants/role-type';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const userIdParams = request.params.id;
		const requester = request.user;

		if (!requester || !requester.userId) {
			throw new ForbiddenException('Unauthorized access');
		}

		const dbUser = await this.userRepository.findOne({
			where: { id: requester.id },
			select: ['id', 'email', 'role'],
		});

		if (!dbUser) {
			throw new ForbiddenException('User not found in database');
		}

		request.isLimitedView = !(
			dbUser.id === userIdParams || dbUser.role === RoleType.ADMIN
		);

		return true;
	}
}
