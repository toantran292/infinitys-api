import {
	CanActivate,
	ExecutionContext,
	Injectable,
	ForbiddenException,
} from '@nestjs/common';
import { UserEntity } from '../modules/users/entities/user.entity';
import { RoleType } from '../constants/role-type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
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
