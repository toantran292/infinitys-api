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

	async toggleUserStatus(id: string, isActive: boolean): Promise<UserEntity> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new NotFoundException('User not found');

		if (user.active === isActive) {
			throw new BadRequestException(`This account is already ${isActive ? 'active' : 'locked'}.`);
		}

		user.active = isActive;
		await this.userRepository.save(user);

		return user;
	}

	async banUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id,false);
		if (user.active) {
			throw new BadRequestException('User is already active.');
		}
		return user;
	}

	async unbanUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id,true);
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