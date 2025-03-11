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
import { AssetsService, FileType } from '../assets/assets.service';
import { AvatarDto } from './dto/avatar.dto';
import { parse as uuidParse } from 'uuid';
import { AssetEntity } from '../assets/entities/asset.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,

		@InjectRepository(AssetEntity)
		private readonly assetRepository: Repository<AssetEntity>,
		private readonly assetsService: AssetsService,
	) { }

	findAll(option: FindManyOptions<UserEntity>) {
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
		// Tách query thành hàm riêng để dễ tái sử dụng
		const userEntity = await this.findUserWithAvatar(userId);

		if (!userEntity) {
			throw new UserNotFoundException();
		}

		// Xử lý avatar
		await this.processUserAvatar(userEntity);

		return userEntity.toDto<UserDto>();
	}

	private async findUserWithAvatar(userId: Uuid) {
		return this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect(
				'user.assets',
				'assets',
				'assets.owner_id = user.id AND assets.owner_type = :ownerType',
				{ ownerType: 'users' }
			)
			.where('user.id = :userId', { userId })
			.getOne();
	}

	private async processUserAvatar(userEntity: UserEntity): Promise<void> {
		// Lấy avatar từ assets (nếu có)
		userEntity.avatar = userEntity.assets?.[0] ?? null;

		// Xóa assets để tránh dư thừa dữ liệu
		delete userEntity.assets;

		// Populate thông tin chi tiết cho avatar
		if (userEntity.avatar) {
			await this.assetsService.populateAsset(userEntity, 'avatar');
		}
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

	async updateAvatar(user_id: Uuid, avatar: AvatarDto) {
		return await this.assetsService.create_or_update(
			FileType.AVATAR,
			'users',
			user_id,
			avatar,
		);
	}
}
