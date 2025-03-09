import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';
import {
	GroupChatEntity,
	GroupChatMemberEntity,
	GroupChatMessageEntity,
} from './entities/chat.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserNotFoundException } from '../../exeptions/user-not-found.exception';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(GroupChatEntity)
		private readonly groupChatRepo: Repository<GroupChatEntity>,
		@InjectRepository(GroupChatMemberEntity)
		private readonly groupChatMemberRepo: Repository<GroupChatMemberEntity>,
		@InjectRepository(GroupChatMessageEntity)
		private readonly groupChatMessageRepo: Repository<GroupChatMessageEntity>,
		private readonly usersService: UsersService,
	) { }

	async getGroupChat(
		userId: Uuid,
		groupChatId: Uuid,
		requireAdmin: boolean = false,
	) {
		const queryBuilder = this.groupChatMemberRepo.createQueryBuilder('members');

		queryBuilder.innerJoinAndSelect('members.groupChat', 'groupChat');
		queryBuilder.innerJoinAndSelect('members.user', 'user');
		queryBuilder.where('user.id = :userId', { userId });
		queryBuilder.andWhere('groupChat.id = :groupChatId', { groupChatId });

		if (requireAdmin) queryBuilder.andWhere('members.isAdmin = true');

		const isExist = await queryBuilder.getExists();

		if (!isExist) return null;

		return this.groupChatRepo
			.createQueryBuilder('groupChat')
			.innerJoinAndSelect('groupChat.groupChatMembers', 'members')
			.innerJoinAndSelect('members.user', 'user')
			.andWhere('groupChat.id = :groupChatId', { groupChatId })
			.getOne();
	}

	findOneGroupChat(
		findData: FindOptionsWhere<GroupChatEntity>,
	): Promise<GroupChatEntity | null> {
		return this.groupChatRepo.findOneBy(findData);
	}

	async getGroupChatsByUserId(userId: Uuid) {
		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		queryBuilder
			.innerJoin('groupChat.groupChatMembers', 'members')
			.innerJoin('members.user', 'user')
			.where('user.id = :userId', { userId });

		return queryBuilder.getMany();
	}

	async getGroupChatById(groupChatId: Uuid): Promise<GroupChatEntity> {
		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		queryBuilder.where('groupChat.id = :groupChatId', { groupChatId });

		const groupChatEntity = await queryBuilder.getOne();

		if (!groupChatEntity) {
			throw new UserNotFoundException();
		}

		return groupChatEntity;
	}

	async getGroupChatByIdAndUser(
		user: UserEntity,
		groupChatId: Uuid,
	): Promise<GroupChatEntity> {
		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		queryBuilder.innerJoinAndSelect('groupChat.groupChatMembers', 'members');
		queryBuilder.innerJoinAndSelect('members.user', 'user');
		queryBuilder.where('user.id = :userId', { userId: user.id });
		queryBuilder.andWhere('groupChat.id = :groupChatId', { groupChatId });

		return queryBuilder.getOne();
	}

	async getPrivateGroupChat(
		userA: UserEntity,
		userB: UserEntity,
	): Promise<GroupChatEntity | null> {
		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		queryBuilder.innerJoinAndSelect('groupChat.groupChatMembers', 'members');
		queryBuilder.innerJoinAndSelect('members.user', 'user');
		queryBuilder.where('user.id IN (:...ids)', { ids: [userA.id, userB.id] });
		queryBuilder.select('groupChat.id');
		queryBuilder.groupBy('groupChat.id');
		queryBuilder.having('COUNT(members.id) = 2');

		const groupChatId = ((await queryBuilder.getOne()) || {}).id;

		if (!groupChatId) return null;

		return this.findOneGroupChat({ id: groupChatId });
	}

	async getGroupChatWithPerson(userA: UserEntity, userBId: Uuid) {
		const recipient = await this.usersService.getRawUser(userBId);

		const groupChat = await this.getPrivateGroupChat(userA, recipient);

		if (!groupChat) {
			throw new NotFoundException();
		}

		return groupChat;
	}

	async createGroupChatMember(groupChat: GroupChatEntity, users: UserEntity[]) {
		const allIsAdmin = users.length === 2;

		const members = users.map((user, index) =>
			this.groupChatMemberRepo.create({
				groupChat: groupChat,
				user: user,
				isAdmin: allIsAdmin ? true : index == 0,
			}),
		);

		await this.groupChatMemberRepo.save(members);
	}

	@Transactional()
	async createPrivateGroupChat(user: UserEntity, recipientId: Uuid) {
		const recipient = await this.usersService.getRawUser(recipientId);

		const existingGroupChat = await this.getPrivateGroupChat(user, recipient);

		// console.log({ existingGroupChat });

		if (existingGroupChat) return existingGroupChat;

		const newGroupChat = this.groupChatRepo.create({
			name: `${user.id} - ${recipientId}`,
		});

		await this.groupChatRepo.save(newGroupChat);

		await this.createGroupChatMember(newGroupChat, [user, recipient]);

		return newGroupChat;
	}

	async createGroupChatMessage(
		user: UserEntity,
		groupChat: GroupChatEntity,
		content: string,
	) {
		const message = this.groupChatMessageRepo.create({
			groupChat,
			user,
			content,
		});

		await this.groupChatMessageRepo.save(message);

		return message;
	}

	async getGroupChatMessages(user: UserEntity, groupChatId: Uuid) {
		const havePermission = await this.getGroupChat(user.id, groupChatId);

		if (!havePermission)
			throw new ForbiddenException(
				'You not have permission to retrieve message of this group',
			);

		const queryBuilder =
			this.groupChatMessageRepo.createQueryBuilder('message');

		queryBuilder
			.innerJoin('message.groupChat', 'groupChat')
			.innerJoinAndSelect('message.user', 'user')
			.where('groupChat.id = :groupChatId', { groupChatId })
			.orderBy('message.createdAt');

		return queryBuilder.getMany();
	}

	async sendMessage(user: UserEntity, groupChatId: Uuid, content: string) {
		const havePermission = await this.getGroupChat(user.id, groupChatId);

		if (!havePermission)
			throw new ForbiddenException(
				'You not have permission to retrieve message of this group',
			);

		const message = this.groupChatMessageRepo.create({
			groupChat: { id: groupChatId },
			content,
			user,
		});

		return await this.groupChatMessageRepo.save(message);
	}
}
