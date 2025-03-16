import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendEntity } from './entities/friend.entity';
import { AssetsService, FileType } from '../assets/assets.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRequestEntity)
		private friendRequestRepository: Repository<FriendRequestEntity>,

		@InjectRepository(FriendEntity)
		private friendRepository: Repository<FriendEntity>,

		@InjectRepository(UserEntity)
		private userRepo: Repository<UserEntity>,

		private readonly assetsService: AssetsService,

		private readonly notificationService: NotificationsService,
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

	async getFriends(userId: Uuid): Promise<UserEntity[]> {
		// Get all friendships where userId is either source or target
		const friendships = await this.friendRepository
			.createQueryBuilder('friend')
			.leftJoinAndSelect('friend.source', 'source')
			.leftJoinAndSelect('friend.target', 'target')
			.where('friend.source_id = :userId OR friend.target_id = :userId', {
				userId,
			})
			.getMany();

		// Extract friend users (excluding the requesting user)
		let friends = friendships.map((friendship) => {
			return friendship.source.id === userId
				? friendship.target
				: friendship.source;
		});
		friends = await this.assetsService.populateAssets(friends, 'users', [
			FileType.AVATAR,
		]);
		return friends;
	}

	async unfriend(sourceId: Uuid, targetId: Uuid): Promise<void> {
		const friendship = await this.findFriendship(sourceId, targetId);

		if (!friendship) {
			throw new NotFoundException('Không tìm thấy bạn bè.');
		}

		await this.friendRepository.delete(friendship.id);
	}
	async getFriendRequests(userId: Uuid): Promise<UserEntity[]> {
		let users = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.where('request.target_id = :userId', { userId })
			.andWhere('request.is_available = true')
			.getMany()
			.then((requests) => requests.map((request) => request.source));

		users = await this.assetsService.populateAssets(users, 'users', [
			FileType.AVATAR,
		]);

		return users;
	}

	async getSentFriendRequests(userId: Uuid): Promise<UserEntity[]> {
		let users = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.target', 'target')
			.where('request.source_id = :userId', { userId })
			.andWhere('request.is_available = true')
			.getMany()
			.then((requests) => requests.map((request) => request.target));

		users = await this.assetsService.populateAssets(users, 'users', [
			FileType.AVATAR,
		]);

		return users;
	}
}
