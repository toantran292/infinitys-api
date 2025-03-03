import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '../users/entities/friend.entity';
import { FriendRequestEntity } from '../users/entities/friend-request.entity';
import { FriendService } from '../users/friend.service';

@Injectable()
export class SearchService {
	constructor(
		private usersService: UsersService,
		private friendService: FriendService,
		@InjectRepository(FriendEntity)
		private readonly friendRepository: Repository<FriendEntity>,
		@InjectRepository(FriendRequestEntity)
		private readonly friendRequestRepository: Repository<FriendRequestEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async searchUser(currentUser: UserEntity, query: string) {
		if (!query) return [];

		const users = await this.userRepository
			.createQueryBuilder('user')
			.where(
				'(user.firstName ILIKE :query OR user.lastName ILIKE :query OR user.email ILIKE :query)',
			)
			.andWhere('user.active = :active', { active: true })
			.andWhere('user.id != :currentUserId', { currentUserId: currentUser.id }) // Exclude current user
			.setParameter('query', `%${query}%`)
			.getMany();

		// Preload friendship statuses in parallel
		const results = await Promise.all(
			users.map(async (user: UserEntity) => {
				const [isFriend, sentRequest, receivedRequest] = await Promise.all([
					this.friendService.findFriendship(currentUser.id, user.id),
					this.friendService.findFriendRequest(currentUser.id, user.id),
					this.friendService.findFriendRequest(user.id, currentUser.id),
				]);

				const friend_status = isFriend
					? 'friend'
					: sentRequest
						? 'sent'
						: receivedRequest
							? 'waiting'
							: null;

				return { ...user, friend_status };
			}),
		);

		return results;
	}
}
