import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssetsService } from '../assets/assets.service';
import { NotificationsService } from '../notifications/notifications.service';

import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendEntity } from './entities/friend.entity';
import { User } from './entities/user.entity';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRequestEntity)
		private friendRequestRepository: Repository<FriendRequestEntity>,

		@InjectRepository(FriendEntity)
		private friendRepository: Repository<FriendEntity>,

		@InjectRepository(User)
		private userRepo: Repository<User>,

		private readonly notificationService: NotificationsService,

		private readonly assetService: AssetsService,
	) {}

	async validate(sourceId: Uuid, targetId: Uuid) {
		if (sourceId === targetId) {
			throw new BadRequestException('Bạn không thể kết bạn với chính mình.');
		}
	}

	async findFriendRequest(
		sourceId: string,
		targetId: string,
	): Promise<FriendRequestEntity | null> {
		return await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('(source.id = :sourceId AND target.id = :targetId)', {
				sourceId,
				targetId,
			})
			.andWhere('request.is_available = :isAvailable', { isAvailable: true })
			.getOne();
	}

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
			.getOne();
	}

	async sendFriendRequest(
		sourceId: Uuid,
		targetId: Uuid,
	): Promise<FriendRequestEntity> {
		await this.validate(sourceId, targetId);

		const existingFriendShip = await this.findFriendship(sourceId, targetId);

		if (existingFriendShip) {
			throw new BadRequestException('Already friend');
		}

		const existingRequest = await this.findFriendRequest(sourceId, targetId);
		if (existingRequest) {
			throw new BadRequestException('Lời mời kết bạn đã được gửi trước đó.');
		}

		const newRequest = this.friendRequestRepository.create({
			source: { id: sourceId },
			target: { id: targetId },
			is_available: true,
		});

		const request = await this.friendRequestRepository.save(newRequest);

		this.notificationService.sendNotificationToUser({
			userId: targetId,
			data: {
				event_name: 'friend_request:sent',
				meta: {
					sourceId,
				},
			},
		});

		return request;
	}

	async acceptFriendRequest(targetId: Uuid, sourceId: Uuid): Promise<void> {
		const waitingRequest = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('request.source_id = :sourceId', { sourceId })
			.andWhere('request.target_id = :targetId', { targetId })
			.andWhere('request.is_available = true')
			.getOne();

		if (!waitingRequest) {
			throw new NotFoundException('Lời mời kết bạn không tồn tại.');
		}

		const { source, target } = waitingRequest;

		const newFriendship = this.friendRepository.create({ source, target });
		await this.friendRepository.save(newFriendship);

		waitingRequest.is_available = false;
		await this.friendRequestRepository.save(waitingRequest);

		this.notificationService.sendNotificationToUser({
			userId: sourceId,
			data: {
				event_name: 'friend_request:accepted',
				meta: {
					targetId,
				},
			},
		});
	}
	async rejectFriendRequest(targetId: Uuid, sourceId: Uuid): Promise<void> {
		const waitingRequest = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('request.source_id = :sourceId', { sourceId })
			.andWhere('request.target_id = :targetId', { targetId })
			.andWhere('request.is_available = true')
			.getOne();

		if (!waitingRequest) {
			throw new NotFoundException('Lời mời kết bạn không tồn tại.');
		}

		waitingRequest.is_available = false;
		await this.friendRequestRepository.save(waitingRequest);
	}

	async cancelFriendRequest(sourceId: Uuid, targetId: Uuid): Promise<void> {
		const friendRequest = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('request.source_id = :sourceId', { sourceId })
			.andWhere('request.target_id = :targetId', { targetId })
			.andWhere('request.is_available = true')
			.getOne();

		if (!friendRequest) {
			throw new NotFoundException('Không tìm thấy yêu cầu kết bạn.');
		}

		friendRequest.is_available = false;
		await this.friendRequestRepository.save(friendRequest);
	}

	async getFriends(userId: Uuid): Promise<User[]> {
		const friendships = await this.friendRepository
			.createQueryBuilder('friend')
			.leftJoinAndSelect('friend.source', 'source')
			.leftJoinAndSelect('friend.target', 'target')
			.where('friend.source_id = :userId OR friend.target_id = :userId', {
				userId,
			})
			.getMany();

		// Extract friend users (excluding the requesting user)
		const friends = friendships.map((friendship) => {
			return friendship.source.id === userId
				? friendship.target
				: friendship.source;
		});

		await this.assetService.attachAssetToEntities(friends);

		return friends;
	}

	async unfriend(sourceId: Uuid, targetId: Uuid): Promise<void> {
		const friendship = await this.findFriendship(sourceId, targetId);

		if (!friendship) {
			throw new NotFoundException('Không tìm thấy bạn bè.');
		}

		await this.friendRepository.delete(friendship.id);
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

		friendRequests.forEach((r) => {
			if (r.request_source_id === currentUser.id) {
				sentRequestMap.set(r.request_target_id, true);
			} else {
				receivedRequestMap.set(r.request_source_id, true);
			}
		});

		targets.map((user) => {
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
	}

	async loadFriendStatus(currentUser: User, target: User) {
		await this.loadFriendStatuses(currentUser, [target]);
	}
}
