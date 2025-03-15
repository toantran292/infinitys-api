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
import { CreateGroupChatDto } from './dto/create-group-chat.dto';

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

	async getGroupChat(userId: Uuid, groupChatId: Uuid) {
		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		queryBuilder.innerJoinAndSelect('groupChat.groupChatMembers', 'members');
		queryBuilder.innerJoinAndSelect('members.user', 'user');
		queryBuilder.where('user.id = :userId', { userId });
		queryBuilder.andWhere('groupChat.id = :groupChatId', { groupChatId });

		const groupChat = await queryBuilder.getOne();

		if (!groupChat) {
			throw new NotFoundException('Group chat not found');
		}

		return groupChat;
	}

	findOneGroupChat(
		findData: FindOptionsWhere<GroupChatEntity>,
	): Promise<GroupChatEntity | null> {
		return this.groupChatRepo.findOneBy(findData);
	}

	async getGroupChatsByUserId(userId: Uuid) {
		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		queryBuilder
			.innerJoinAndSelect('groupChat.groupChatMembers', 'members')
			.innerJoinAndSelect('members.user', 'user')
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
		const members = users.map((user, index) =>
			this.groupChatMemberRepo.create({
				groupChat: groupChat,
				user: user,
				isAdmin: index === 0,
			}),
		);

		await this.groupChatMemberRepo.save(members);
	}

	@Transactional()
	async createGroupChat(admin: UserEntity, createGroupChatDto: CreateGroupChatDto) {
		const { userIds, name } = createGroupChatDto;

		const users = await this.usersService.getUsersByIds(userIds);

		const newGroupChat = this.groupChatRepo.create({
			name: name || "",
		});

		await this.groupChatRepo.save(newGroupChat);

		await this.createGroupChatMember(newGroupChat, [admin, ...users]);

		return this.getGroupChat(admin.id, newGroupChat.id);
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
		await this.getGroupChat(user.id, groupChatId);

		const queryBuilder = this.groupChatMessageRepo.createQueryBuilder('message');

		queryBuilder
			.innerJoin('message.groupChat', 'groupChat')
			.innerJoinAndSelect('message.user', 'user')
			.where('groupChat.id = :groupChatId', { groupChatId })
			.orderBy('message.createdAt');

		return queryBuilder.getMany();
	}

	async sendMessage(user: UserEntity, groupChatId: Uuid, content: string) {
		await this.getGroupChat(user.id, groupChatId);

		const message = this.groupChatMessageRepo.create({
			groupChat: { id: groupChatId },
			content,
			user,
		});

		return await this.groupChatMessageRepo.save(message);
	}
}
