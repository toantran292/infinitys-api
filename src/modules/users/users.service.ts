import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, type FindOptionsWhere, In, Repository } from 'typeorm';
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
import { RoleType } from 'src/constants/role-type';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,

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

	async getRawUser(userId: Uuid, options?: { role?: RoleType }): Promise<UserEntity> {
		const queryBuilder = this.userRepository.createQueryBuilder('user');

		queryBuilder.where('user.id = :userId', { userId });

		if (options?.role) {
			queryBuilder.andWhere('user.role = :role', { role: options.role });
		}

		const userEntity = await queryBuilder.getOne();

		if (!userEntity) {
			throw new UserNotFoundException();
		}

		return userEntity;
	}

	async getUser(userId: Uuid, findData?: Omit<FindOptionsWhere<UserEntity>, 'id'>): Promise<UserEntity> {
		let user = await this.findOne({ id: userId, ...findData });

		user = await this.assetsService.populateAsset(user, 'users', [FileType.AVATAR]);

		return user;
	}

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
