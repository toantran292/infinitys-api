import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async findOne(id: string, isLimitedView: boolean): Promise<Partial<UserEntity>> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new NotFoundException('User not found');

		if (isLimitedView) {
			return new UserDto(user);
		}
		return user;
	}

	async findAll(): Promise<UserEntity[]> {
		return this.userRepository.find();
	}

	async toggleUserStatus(id: string, action: 'ban' | 'unban'): Promise<UserEntity> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new NotFoundException('User not found');

		if (action === 'ban' && !user.active) {
			throw new BadRequestException('This account is already locked.');
		}

		if (action === 'unban' && user.active) {
			throw new BadRequestException('This account is already active.');
		}

		user.active = action === 'unban'; // Nếu action là 'unban' thì true, ngược lại là false.
		await this.userRepository.save(user);

		console.log(`${user.email}'s account has been ${user.active ? 'unlocked' : 'locked'}.`);
		return user;
	}

	async banUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id,'ban');
		if (user.active) {
			throw new BadRequestException('User is already active.');
		}
		return user;
	}

	async unbanUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id,'unban');
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