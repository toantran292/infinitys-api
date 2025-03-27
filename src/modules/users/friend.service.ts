import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssetsService } from '../assets/assets.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NewsfeedService } from '../newsfeed/newsfeed.service';

import {
	FriendEntity,
	FriendshipStatus,
	FriendStatus,
} from './entities/friend.entity';
import { User } from './entities/user.entity';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendEntity)
		private friendRepository: Repository<FriendEntity>,

		private readonly notificationService: NotificationsService,

		private readonly assetService: AssetsService,

		private readonly newsfeedService: NewsfeedService,
	) {}

	async validate(sourceId: string, targetId: string) {
		if (sourceId === targetId) {
			throw new BadRequestException('Bạn không thể kết bạn với chính mình.');
		}
	}

	/**
	 * Find friendship between sourceId and targetId
	 * Ignore the direction of friendship
	 * @param sourceId - id of user
	 * @param targetId - id of user
	 * @returns - friendship or null if not exists
	 */
	async findFriendship(
		sourceId: string,
		targetId: string,
	): Promise<FriendEntity | null> {
		return await this.friendRepository
			.createQueryBuilder('friend')
			.where(
				'(friend.source = :sourceId AND friend.target = :targetId) OR (friend.source = :targetId AND friend.target = :sourceId)',
				{ sourceId, targetId },
			)
			.orderBy('friend.createdAt', 'DESC')
			.getOne();
	}

	/**
	 * Find friendship request between sourceId and targetId
	 * @param sourceId - id of user
	 * @param targetId - id of user
	 * @returns - friendship request or null if not exists
	 */
	async findFriendRequest(
		sourceId: string,
		targetId: string,
	): Promise<FriendEntity | null> {
		return await this.friendRepository
			.createQueryBuilder('friend')
			.where('friend.source = :sourceId AND friend.target = :targetId', {
				sourceId,
				targetId,
			})
			.andWhere('friend.status = :status', {
				status: FriendshipStatus.PENDING,
			})
			.getOne();
	}

	async isFriend(sourceId: string, targetId: string): Promise<boolean> {
		const friendship = await this.findFriendship(sourceId, targetId);
		return friendship?.status === FriendshipStatus.ACCEPTED;
	}

	/**
	 * Send friendship request from sourceId to targetId
	 * Make sure that the friendship between sourceId and targetId is only one.
	 * @param sourceId - id of user
	 * @param targetId - id of user
	 * @returns - friendship
	 */
	async sendFriendRequest(
		sourceId: string,
		targetId: string,
	): Promise<FriendEntity> {
		await this.validate(sourceId, targetId);

		const existingFriendship = await this.findFriendship(sourceId, targetId);
		if (existingFriendship) {
			if (existingFriendship.status === FriendshipStatus.ACCEPTED) {
				throw new BadRequestException('Đã là bạn bè.');
			}
			if (existingFriendship.status === FriendshipStatus.PENDING) {
				throw new BadRequestException('Lời mời kết bạn đã được gửi.');
			}
		}

		const friendship = this.friendRepository.create({
			source: { id: sourceId },
			target: { id: targetId },
			status: FriendshipStatus.PENDING,
		});

		await this.friendRepository.save(friendship);

		this.notificationService.sendNotificationToUser({
			userId: targetId,
			data: {
				event_name: 'friend_request:sent',
				meta: { sourceId },
			},
		});

		return friendship;
	}

	async acceptFriendRequest(targetId: Uuid, sourceId: Uuid): Promise<void> {
		const friendship = await this.findFriendRequest(sourceId, targetId);

		if (!friendship) {
			throw new NotFoundException('Lời mời kết bạn không tồn tại.');
		}

		friendship.status = FriendshipStatus.ACCEPTED;
		await this.friendRepository.save(friendship);

		this.notificationService.sendNotificationToUser({
			userId: sourceId,
			data: {
				event_name: 'friend_request:accepted',
				meta: { targetId },
			},
		});

		await this.newsfeedService.handleNewFriendship(sourceId, targetId);
		await this.newsfeedService.handleNewFriendship(targetId, sourceId);
	}

	async cancelFriendRequest(sourceId: Uuid, targetId: Uuid): Promise<void> {
		const friendship = await this.findFriendship(sourceId, targetId);

		if (!friendship) {
			throw new NotFoundException('Kết nối không tồn tại');
		}

		await this.friendRepository.remove(friendship);

		// Xóa bài viết khỏi newsfeed của cả hai người
		await this.newsfeedService.handleUnfriend(sourceId, targetId);
		await this.newsfeedService.handleUnfriend(targetId, sourceId);
	}

	async getFriends(userId: string): Promise<User[]> {
		const friendships = await this.friendRepository
			.createQueryBuilder('friend')
			.leftJoinAndSelect('friend.source', 'source')
			.leftJoinAndSelect('friend.target', 'target')
			.where('(friend.source = :userId OR friend.target = :userId)', { userId })
			.andWhere('friend.status = :status', {
				status: FriendshipStatus.ACCEPTED,
			})
			.getMany();

		return friendships.map((friendship) =>
			friendship.source.id === userId ? friendship.target : friendship.source,
		);
	}

	async searchFriends(query: string, userId: Uuid) {
		const friendships = await this.friendRepository
			.createQueryBuilder('friend')
			.leftJoinAndSelect('friend.source', 'source')
			.leftJoinAndSelect('friend.target', 'target')
			.where(
				'(friend.source_id = :userId OR friend.target_id = :userId) AND friend.status = :status AND (LOWER(source.firstName) LIKE LOWER(:query) OR LOWER(source.lastName) LIKE LOWER(:query) OR LOWER(target.firstName) LIKE LOWER(:query) OR LOWER(target.lastName) LIKE LOWER(:query))',
				{
					userId,
					status: FriendshipStatus.ACCEPTED,
					query: `%${query}%`,
				},
			)
			.getMany();

		const users = friendships.map((friendship) =>
			friendship.source.id === userId ? friendship.target : friendship.source,
		);

		await this.assetService.attachAssetToEntities(users);

		return users;
	}

	async loadFriendStatuses(currentUser: User, targets: User[]) {
		if (targets.length === 0) return;

		const userIds = targets.map((u) => u.id);
		const friendships = await this.friendRepository
			.createQueryBuilder('friend')
			.where(
				'(friend.source IN (:...userIds) AND friend.target = :currentUserId) OR (friend.target IN (:...userIds) AND friend.source = :currentUserId)',
				{ userIds, currentUserId: currentUser.id },
			)
			.getMany();

		targets.forEach((user) => {
			const friendship = friendships.find(
				(f) => f.sourceId === user.id || f.targetId === user.id,
			);

			user.friendStatus = this.getFriendStatus(
				friendship?.status,
				currentUser,
				friendship,
			);
		});
	}

	async loadFriendStatus(currentUser: User, target: User) {
		await this.loadFriendStatuses(currentUser, [target]);
	}

	/**
	 * Get friend status
	 * @param status - status of friendship
	 * @param currentUser - current user or user id
	 * @param friendship - friendship
	 * @returns - friend status
	 */
	getFriendStatus(
		status: FriendshipStatus | null,
		currentUser: User | Uuid,
		friendship: FriendEntity,
	) {
		switch (status) {
			case FriendshipStatus.ACCEPTED:
				return FriendStatus.FRIEND;
			case FriendshipStatus.PENDING:
				const id = currentUser instanceof User ? currentUser.id : currentUser;
				return id === friendship.sourceId
					? FriendStatus.WAITING
					: FriendStatus.RECEIVED;
			default:
				return null;
		}
	}
}
