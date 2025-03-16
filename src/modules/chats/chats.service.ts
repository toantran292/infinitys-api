import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, type FindOptionsWhere, Repository } from 'typeorm';
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
import { GroupChatPageOptionsDto } from './dto/group-chat-page-options-dto';
import { FileType } from '../assets/assets.service';
import { AssetsService } from '../assets/assets.service';
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
		private readonly assetsService: AssetsService,
	) { }

	findOneGroupChat(
		findData: FindOptionsWhere<GroupChatEntity>,
	): Promise<GroupChatEntity | null> {
		return this.groupChatRepo.findOneBy(findData);
	}

	// Thêm hàm escape string
	private escapeLikeString(str: string): string {
		return str.replace(/[\\%_]/g, '\\$&');
	}

	async getGroupChatsByUserId(userId: Uuid, groupsChatOptionsDto: GroupChatPageOptionsDto) {
		const { q } = groupsChatOptionsDto

		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		queryBuilder
			.innerJoinAndSelect('groupChat.groupChatMembers', 'members')
			.innerJoinAndSelect('members.user', 'user')
			.where('user.id = :userId', { userId })

		if (q) {
			const escapedSearch = this.escapeLikeString(q);
			queryBuilder.andWhere(new Brackets(qb => {
				qb
					.where('LOWER(groupChat.name) LIKE LOWER(:search) ESCAPE \'\\\'', {
						search: `%${escapedSearch}%`
					})
					.orWhere(
						`groupChat.id IN (
							SELECT gcm.group_chat_id 
							FROM group_chat_members gcm 
							INNER JOIN users u ON u.id = gcm.user_id 
							WHERE (LOWER(u.first_name) LIKE LOWER(:search) ESCAPE '\\'
							OR LOWER(u.last_name) LIKE LOWER(:search) ESCAPE '\\')
							AND u.id != :userId
						)`,
						{
							search: `%${escapedSearch}%`,
							userId
						}
					);
			}));
		}

		const groupChatIds = (await queryBuilder.select('groupChat.id').getMany()).map(
			(groupChat) => groupChat.id,
		);

		if (groupChatIds.length === 0) return [];

		let groups = await this.groupChatRepo
			.createQueryBuilder('groupChat')
			.innerJoinAndSelect('groupChat.groupChatMembers', 'members')
			.innerJoinAndSelect('members.user', 'user')
			.leftJoinAndSelect(
				'groupChat.groupChatMessages',
				'messages',
				`messages.id IN (
					SELECT m2.id FROM group_chat_messages m2 
					WHERE m2.group_chat_id = groupChat.id 
					ORDER BY m2.created_at DESC 
					LIMIT 1
				)`,
			)
			.leftJoinAndSelect('messages.user', 'messageUser')
			.andWhere('groupChat.id IN (:...groupChatIds)', { groupChatIds })
			.andWhere('user.id != :userId', { userId })
			.orderBy('messages.createdAt', 'DESC', 'NULLS LAST')
			.getMany();

		await Promise.all(groups.map(async (group) => {
			group.members = await Promise.all(group.groupChatMembers.map(async (member) => {
				return await this.assetsService.populateAsset(member.user, 'users', [FileType.AVATAR]);
			}));
			return group;
		}));

		return groups;
	}

	async getGroupChatById(groupChatId: Uuid): Promise<GroupChatEntity> {
		const queryBuilder = this.groupChatRepo.createQueryBuilder('groupChat');

		const groupChatEntity = await queryBuilder.getOne();

		if (!groupChatEntity) {
			throw new UserNotFoundException();
		}

		return groupChatEntity;
	}

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

		const group = await this.groupChatRepo
			.createQueryBuilder('groupChat')
			.innerJoinAndSelect('groupChat.groupChatMembers', 'members')
			.innerJoinAndSelect('members.user', 'user')
			.leftJoinAndSelect(
				'groupChat.groupChatMessages',
				'messages',
				`messages.id IN (
					SELECT m2.id FROM group_chat_messages m2 
					WHERE m2.group_chat_id = groupChat.id 
					ORDER BY m2.created_at DESC 
					LIMIT 1
				)`,
			)
			.leftJoinAndSelect('messages.user', 'messageUser')
			.andWhere('user.id != :userId', { userId })
			.andWhere('groupChat.id = :groupChatId', { groupChatId })
			.getOne();

		group.members = await Promise.all(group.groupChatMembers.map(async (member) => {
			return await this.assetsService.populateAsset(member.user, 'users', [FileType.AVATAR]);
		}));

		return group;
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

		const messages = await queryBuilder.getMany();

		await Promise.all(messages.map(async (message) => {
			message.user = await this.assetsService.populateAsset(message.user, 'users', [FileType.AVATAR]);
			return message;
		}));

		return messages;
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
