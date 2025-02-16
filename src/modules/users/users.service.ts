import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async getUserProfile(userId: string) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['posts'],
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			fullName: `${user.firstName} ${user.lastName}`,
			email: user.email,
			dateOfBirth: user.dateOfBirth,
			gender: user.gender,
			major: user.major,
			desiredJobPosition: user.desiredJobPosition,
			posts: user.posts.map((post) => ({
				id: post.id,
				content: post.content,
				createdAt: post.createdAt,
			})),
		};
	}

	async editUserProfile(userId: string, updateData: UpdateUserProfileDto) {
		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException('Không tìm thấy người dùng');
		}

		const dtoInstance = plainToClass(UpdateUserProfileDto, updateData);

		const errors = await validate(dtoInstance);

		if (errors.length > 0) {
			throw new BadRequestException(
				errors.map((err) => ({
					field: err.property,
					errors: Object.values(err.constraints || {}),
				})),
			);
		}

		Object.assign(user, updateData);

		await this.userRepository.save(user);
		return { message: 'Cập nhật hồ sơ cá nhân thành công', user };
	}

	async findOne(
		id: string,
		isLimitedView: boolean,
	): Promise<Partial<UserEntity>> {
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
			throw new BadRequestException(
				`This account is already ${isActive ? 'active' : 'locked'}.`,
			);
		}

		user.active = isActive;
		await this.userRepository.save(user);

		return user;
	}

	async banUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id, false);
		if (user.active) {
			throw new BadRequestException('User is already active.');
		}
		return user;
	}

	async unbanUser(id: string): Promise<UserEntity> {
		const user = await this.toggleUserStatus(id, true);
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
