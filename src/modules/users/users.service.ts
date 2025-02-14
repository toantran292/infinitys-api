import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}
	async findOne(id: string): Promise<UserEntity> {
		return this.userRepository.findOne({ where: { id } });
	}
	async findAll(): Promise<UserEntity[]> {
		return this.userRepository.find();
	}
	async toggleUserStatus(id: string, isActive: boolean, action: string): Promise<UserEntity> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new NotFoundException('User not found');

		if (user.active === isActive) {
			throw new BadRequestException(
				`This account has been ${isActive ? 'active' : 'locked'} before.`
			);
		}

		user.active = isActive;
		await this.userRepository.save(user);
		console.log(`${user.email}'s account has been ${isActive ? 'unlocked' : 'locked'}.`);

		return user;
	}

	async banUser(id: string): Promise<UserEntity> {
		return this.toggleUserStatus(id, false, 'ban');
	}

	async unbanUser(id: string): Promise<UserEntity> {
		return this.toggleUserStatus(id, true, 'unban');
	}

	async deleteUser(id: string): Promise<void> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('Not found user');
		}
		await this.userRepository.remove(user);
	}
}