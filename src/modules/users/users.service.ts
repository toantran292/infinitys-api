import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	FindManyOptions,
	type FindOptionsWhere,
	Repository,
} from 'typeorm';
import { UserEntity } from './entities/user.entity';
import type { UsersPageOptionsDto } from './dto/user-page-options.dto';
import { Transactional } from 'typeorm-transactional';
import type { UserRegisterDto } from '../auths/dto/user-register.dto';
import { UserNotFoundException } from '../../exeptions/user-not-found.exception';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AssetsService, FileType } from '../assets/assets.service';
import { AvatarDto, BannerDto } from './dto/avatar.dto';
import { RoleType } from 'src/constants/role-type';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
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
		const existingUser = await this.findOne({ email: createUserDto.email });

		if (existingUser) {
			throw new BadRequestException('error.user_already_exists');
		}

		const user = this.userRepository.create(createUserDto);

		await this.userRepository.save(user);

		return user;
	}

	async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<{
		items: UserEntity[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = this.userRepository.createQueryBuilder('user');
		const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

		return {
			items,
			meta: pageMetaDto,
		};
	}

	async getRawUser(
		userId: Uuid,
		options?: { role?: RoleType },
	): Promise<UserEntity> {
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

	async getUser(
		userId: Uuid,
		findData?: Omit<FindOptionsWhere<UserEntity>, 'id'>,
	): Promise<UserEntity> {
		const user = await this.findOne({ id: userId, ...findData });

		await this.assetsService.attachAssetToEntity(user);

		return user;
	}

	async getUsersByIds(userIds: Uuid[]): Promise<UserEntity[]> {
		const users = await this.userRepository.find({
			where: { id: In(userIds) },
		});

		if (users.length !== userIds.length) {
			throw new UserNotFoundException();
		}

		await this.assetsService.attachAssetToEntities(users);

		return users;
	}

	async editUserProfile(
		user: UserEntity,
		userProfileDto: UpdateUserProfileDto,
	) {
		this.userRepository.merge(user, userProfileDto);

		const updatedUser = await this.userRepository.save(user);

		return updatedUser;
	}

	async updateAsset(
		user_id: Uuid,
		asset: AvatarDto | BannerDto,
		type: FileType,
	) {
		const user = await this.userRepository.findOne({
			where: {
				id: user_id,
			},
		});

		return await this.assetsService.addAssetToEntity(user, {
			type,
			file_data: asset,
		});
	}
}
