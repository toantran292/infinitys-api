import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleType } from '../../constants/role-type';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async findOne(id: string, requester: string): Promise<Partial<UserEntity>> {
		const user = await this.userRepository.findOne({ where: { id } });
		const requesterUser = await this.userRepository.findOne({ where: { id:requester } });
		if (!user) throw new NotFoundException('User not found');
		if (this.isOwnerOrAdmin(user.id, requesterUser)) {
			const { password, ...userWithoutPassword } = user;
			return userWithoutPassword;
		}

		return {
			firstName: user.firstName,
			lastName: user.lastName,
			fullName: user.fullName,
			email: user.email,
		};
	}

	private isOwnerOrAdmin(userId: string, requester: UserEntity): boolean {
		return requester.id === userId || requester.role === RoleType.ADMIN;
	}

	async findAll(): Promise<UserEntity[]> {
		return this.userRepository.find();
	}

	async toggleUserStatus(id: string): Promise<UserEntity> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new NotFoundException('User not found');

		user.active = !user.active;

		await this.userRepository.save(user);
		console.log(`${user.email}'s account has been ${user.active ? 'unlocked' : 'locked'}.`);

		return user;
	}

	async banUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id);
		if (user.active) {
			throw new BadRequestException('User is already active.');
		}
		return user;
	}

	async unbanUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id);
		if (!user.active) {
			throw new BadRequestException('User is already banned.');
		}
		return user;
	}


	async deleteUser(id: string): Promise<void> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('Not found user');
		}
		await this.userRepository.remove(user);
	}
}