import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	FindManyOptions,
	type FindOptionsWhere,
	In,
	Repository,
} from 'typeorm';
import { User } from './entities/user.entity';
import type { UsersPageOptionsDto } from './dto/user-page-options.dto';
import { Transactional } from 'typeorm-transactional';
import type { UserRegisterDto } from '../auths/dto/user-register.dto';
import { UserNotFoundException } from '../../exeptions/user-not-found.exception';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AssetsService, FileType } from '../assets/assets.service';
import { AvatarDto, BannerDto } from './dto/avatar.dto';
import { RoleType } from 'src/constants/role-type';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { FriendService } from './friend.service';
import { CreateAssetDto } from '../assets/dto/create-asset.dto';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		private readonly assetsService: AssetsService,

		private readonly friendService: FriendService,
	) {}

	findAll(option: FindManyOptions<User>) {
		return this.userRepository.find(option);
	}

	findOne(findData: FindOptionsWhere<User>): Promise<User | null> {
		return this.userRepository.findOneBy(findData);
	}

	@Transactional()
	async createUser(createUserDto: UserRegisterDto): Promise<User> {
		const existingUser = await this.findOne({ email: createUserDto.email });

		if (existingUser) {
			throw new BadRequestException('error.user_already_exists');
		}

		const user = this.userRepository.create(createUserDto);

		await this.userRepository.save(user);

		return user;
	}

	async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<{
		items: User[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = this.userRepository.createQueryBuilder('user');
		const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

		return {
			items,
			meta: pageMetaDto,
		};
	}

	async getRawUser(userId: Uuid, options?: { role?: RoleType }): Promise<User> {
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
		currentUser: User,
		userId: Uuid,
		findData?: Omit<FindOptionsWhere<User>, 'id'>,
	): Promise<User> {
		const user = await this.findOne({ id: userId, ...findData });

		await this.assetsService.attachAssetToEntity(user);

		if (currentUser) {
			await this.friendService.loadFriendStatus(currentUser, user);
		}

		user.total_connections = (
			await this.friendService.getFriends(userId)
		).length;

		return user;
	}

	async getUsersByIds(userIds: Uuid[]): Promise<User[]> {
		const users = await this.userRepository.find({
			where: { id: In(userIds) },
		});

		if (users.length !== userIds.length) {
			throw new UserNotFoundException();
		}

		await this.assetsService.attachAssetToEntities(users);

		return users;
	}

	async editUserProfile(user: User, userProfileDto: UpdateUserProfileDto) {
		this.userRepository.merge(user, userProfileDto);

		const updatedUser = await this.userRepository.save(user);

		return updatedUser;
	}

	async updateAsset(user_id: Uuid, asset: CreateAssetDto, type: FileType) {
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
