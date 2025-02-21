import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendEntity } from './entities/friend.entity';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRequestEntity)
		private friendRequestRepository: Repository<FriendRequestEntity>,

		@InjectRepository(FriendEntity)
		private friendRepository: Repository<FriendEntity>,

		@InjectRepository(UserEntity)
		private userRepo: Repository<UserEntity>,
	) {}

	private async findFriendRequest(sourceId: string, targetId: string): Promise<FriendRequestEntity | null> {
		return await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('(source.id = :sourceId AND target.id = :targetId) OR (source.id = :targetId AND target.id = :sourceId)', { sourceId, targetId })
			.andWhere('request.is_available = :isAvailable', { isAvailable: true })
			.getOne();

	}

	private async findFriendship(sourceId: string, targetId: string): Promise<FriendEntity | null> {
		return await this.friendRepository
			.createQueryBuilder('friend')
			.where(
				'(friend.source = :sourceId AND friend.target = :targetId) OR (friend.source = :targetId AND friend.target = :sourceId)',
				{ sourceId, targetId }
			)
			.getOne();
	}

	async sendFriendRequest(sourceId: string, targetId: string): Promise<FriendRequestEntity> {
		if (sourceId === targetId) {
			throw new BadRequestException('Bạn không thể kết bạn với chính mình.');
		}

		const existingRequest = await this.findFriendRequest(sourceId, targetId);
		if (existingRequest) {
			if (!existingRequest.is_available) {
				existingRequest.is_available = true;
				return this.friendRequestRepository.save(existingRequest);
			}
			throw new BadRequestException('Lời mời kết bạn đã được gửi trước đó.');
		}

		const newRequest = this.friendRequestRepository.create({
			source: { id: sourceId },
			target: { id: targetId },
			is_available: true,
		});

		return this.friendRequestRepository.save(newRequest);
	}

	async acceptFriendRequest(requestId: string): Promise<void> {
		const friendRequest = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('request.id = :requestId', { requestId })
			.andWhere('request.is_available = true')
			.getOne();


		if (!friendRequest) {
			throw new NotFoundException('Lời mời kết bạn không tồn tại.');
		}

		const { source, target } = friendRequest;

		const existingFriendship = await this.findFriendship(source.id, target.id);
		if (existingFriendship) {
			throw new BadRequestException('Hai người đã là bạn bè.');
		}

		const newFriendship = this.friendRepository.create({ source, target });
		await this.friendRepository.save(newFriendship);

		friendRequest.is_available = false;
		await this.friendRequestRepository.save(friendRequest);
	}

	async rejectFriendRequest(requestId: string): Promise<void> {
		const request = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('request.id = :requestId', { requestId })
			.andWhere('request.is_available = true')
			.getOne();


		if (!request) {
			throw new NotFoundException('Lời mời kết bạn không tồn tại.');
		}

		request.is_available = false;
		await this.friendRequestRepository.save(request);
	}

	async removeFriendRequest(userId: string, friendId: string): Promise<void> {
		const request = await this.friendRequestRepository
			.createQueryBuilder('request')
			.leftJoinAndSelect('request.source', 'source')
			.leftJoinAndSelect('request.target', 'target')
			.where('request.id = :friendId', { friendId })
			.andWhere('request.source.id = :userId', { userId })
			.andWhere('request.is_available = true')
			.getOne();


		if (!request) {
			throw new NotFoundException('Không tìm thấy yêu cầu kết bạn.');
		}

		request.is_available = false;
		await this.friendRequestRepository.save(request);
	}
}
