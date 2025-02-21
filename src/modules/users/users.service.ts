import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, type FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import type { UsersPageOptionsDto } from './dto/user-page-options.dto';
import type { PageDto } from '../../common/dto/page.dto';
import { Transactional } from 'typeorm-transactional';
import type { UserRegisterDto } from '../auths/dto/user-register.dto';
import { UserNotFoundException } from '../../exeptions/user-not-found.exception';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	findAll(option: FindManyOptions<UserEntity>){
		return this.userRepository.find(option);
	}

	findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
		return this.userRepository.findOneBy(findData);
	}

	@Transactional()
	async createUser(createUserDto: UserRegisterDto): Promise<UserEntity> {
		const user = this.userRepository.create(createUserDto);

		await this.userRepository.save(user);

		return user;
	}

	async getUsers(
		pageOptionsDto: UsersPageOptionsDto,
	): Promise<PageDto<UserDto>> {
		const queryBuilder = this.userRepository.createQueryBuilder('user');
		const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

		return items.toPageDto(pageMetaDto);
	}

	async getRawUser(userId: Uuid): Promise<UserEntity> {
		const queryBuilder = this.userRepository.createQueryBuilder('user');

		queryBuilder.where('user.id = :userId', { userId });

		const userEntity = await queryBuilder.getOne();

		if (!userEntity) {
			throw new UserNotFoundException();
		}

		return userEntity;
	}

	async getUser(userId: Uuid): Promise<UserDto> {
		const userEntity = await this.getRawUser(userId);
		return userEntity.toDto<UserDto>();
	}

	// async getUserProfile(userId: Uuid): Promise<UserDto> {
	// 	const user = await this.userRepository.findOne({
	// 		where: { id: userId },
	// 		relations: ['posts'],
	// 	});
	//
	// 	if (!user) {
	// 		throw new NotFoundException('User not found');
	// 	}
	//
	// 	return plainToInstance(UserProfileDto, user, {
	// 		excludeExtraneousValues: true,
	// 	});
	// }
	//

	async editUserProfile(
		user: UserEntity,
		userProfileDto: UpdateUserProfileDto,
	) {
		this.userRepository.merge(user, userProfileDto);

		const updatedUser = await this.userRepository.save(user);

		return updatedUser.toDto<UserDto>();
	}

	// async toggleUserStatus(id: string, isActive: boolean): Promise<UserEntity> {
	// 	const user = await this.userRepository.findOne({ where: { id } });
	// 	if (!user) throw new NotFoundException('User not found');
	//
	// 	if (user.active === isActive) {
	// 		throw new BadRequestException(
	// 			`This account is already ${isActive ? 'active' : 'locked'}.`,
	// 		);
	// 	}
	//
	// 	user.active = isActive;
	// 	await this.userRepository.save(user);
	//
	// 	return user;
	// }

	// async banUser(id: string): Promise<UserEntity> {
	// 	const user = await this.toggleUserStatus(id, false);
	// 	if (user.active) {
	// 		throw new BadRequestException('User is already active.');
	// 	}
	// 	return user;
	// }
	//
	// async unbanUser(id: string): Promise<UserEntity> {
	// 	const user = await this.toggleUserStatus(id, true);
	// 	if (!user.active) {
	// 		throw new BadRequestException('User is already banned.');
	// 	}
	// 	return user;
	// }
}
