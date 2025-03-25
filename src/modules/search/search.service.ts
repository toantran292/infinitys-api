import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '../users/entities/friend.entity';
import { FriendRequestEntity } from '../users/entities/friend-request.entity';
import { FriendService } from '../users/friend.service';
import { SearchPageOptionDto } from './dto/search-page-option.dto';
import { AssetsService } from '../assets/assets.service';
@Injectable()
export class SearchService {
	constructor(
		private usersService: UsersService,
		private friendService: FriendService,
		private assetService: AssetsService,
		@InjectRepository(FriendEntity)
		private readonly friendRepository: Repository<FriendEntity>,
		@InjectRepository(FriendRequestEntity)
		private readonly friendRequestRepository: Repository<FriendRequestEntity>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async searchUser(currentUser: User, searchPageOption: SearchPageOptionDto) {
		if (!searchPageOption.q) return [];

		const [users, pageMeta] = await this.userRepository
			.createQueryBuilder('user')
			.where(
				'(user.firstName ILIKE :query OR user.lastName ILIKE :query OR user.email ILIKE :query)',
			)
			.andWhere('user.active = :active', { active: true })
			.andWhere('user.id != :currentUserId', { currentUserId: currentUser.id })
			.setParameter('query', `%${searchPageOption.q}%`)
			.paginate(searchPageOption);

		await this.assetService.attachAssetToEntities(users);

		await this.friendService.loadFriendStatuses(currentUser, users);

		return {
			items: users,
			meta: pageMeta,
		};
	}
}
