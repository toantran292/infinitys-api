import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
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
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async searchUser(
		currentUser: UserEntity,
		searchPageOption: SearchPageOptionDto,
	) {
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

		const userIds = users.map((u) => u.id);

		const friendships = await this.friendRepository
			.createQueryBuilder('friend')
			.where(
				'(friend.source IN (:...userIds) AND friend.target = :currentUserId) OR (friend.target IN (:...userIds) AND friend.source = :currentUserId)',
				{ userIds, currentUserId: currentUser.id },
			)
			.getRawMany();

		const friendRequests = await this.friendRequestRepository
			.createQueryBuilder('request')
			.where(
				'(request.source IN (:...userIds) AND request.target = :currentUserId) OR (request.target IN (:...userIds) AND request.source = :currentUserId)',
				{ userIds, currentUserId: currentUser.id },
			)
			.andWhere('request.is_available = true')
			.getRawMany();

		const friendshipMap = new Map<string, boolean>();
		friendships.forEach((f) => {
			const key =
				f.friend_target_id === currentUser.id
					? f.friend_source_id
					: f.friend_target_id;
			friendshipMap.set(key, true);
		});

		const sentRequestMap = new Map<string, boolean>();
		const receivedRequestMap = new Map<string, boolean>();

		console.log({ friendRequests });
		friendRequests.forEach((r) => {
			if (r.request_source_id === currentUser.id) {
				sentRequestMap.set(r.request_target_id, true);
			} else {
				receivedRequestMap.set(r.request_source_id, true);
			}
		});

		users.map((user) => {
			const isFriend = friendshipMap.has(user.id);
			const sent = sentRequestMap.has(user.id);
			const received = receivedRequestMap.has(user.id);

			const friend_status = isFriend
				? 'friend'
				: sent
					? 'sent'
					: received
						? 'waiting'
						: null;

			user.friend_status = friend_status;
		});

		await this.assetService.attachAssetToEntities(users);

		return {
			items: users,
			meta: pageMeta,
		};
	}
}
