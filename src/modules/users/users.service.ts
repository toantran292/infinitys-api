import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	// 1. Lấy danh sách tất cả người dùng
	async findAll(): Promise<UserEntity[]> {
		return this.userRepository.find();
	}

	async banUser(id:string):Promise<UserEntity>{
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('Not found user');
		}

		if (!user.active) {
			throw new BadRequestException('This account has been locked previously.');
		}

		user.active = false;
		await this.userRepository.save(user);

		console.log(`${user.email}'s account has been locked. Please contact support staff.`);
		return user;
	}

	async unbanUser(id: string): Promise<UserEntity> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('Not found user');
		}

		if (user.active) {
			throw new BadRequestException('This account has been active before.');
		}

		user.active = true;
		return this.userRepository.save(user);
	}

	async deleteUser(id: string): Promise<void> {
		const user = await this.userRepository.findOne({ where: { id } });

		if (!user) {
			throw new NotFoundException('Not found user');
		}

		await this.userRepository.remove(user);

	}
}