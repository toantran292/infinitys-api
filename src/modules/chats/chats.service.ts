import {
	BadRequestException,
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { AssetsService } from '../assets/assets.service';
import { PagesService } from '../pages/pages.service';
import { UsersService } from '../users/users.service';

import { ConversationReadStatus } from './entities/conversation-read-status.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(Conversation)
		private readonly convRepo: Repository<Conversation>,

		@InjectRepository(Participant)
		private readonly participantRepo: Repository<Participant>,

		@InjectRepository(Message)
		private readonly msgRepo: Repository<Message>,

		@InjectRepository(ConversationReadStatus)
		private readonly readRepo: Repository<ConversationReadStatus>,

		private readonly usersService: UsersService,
		private readonly pageService: PagesService,
		private readonly assetsService: AssetsService,
	) {}
	@Transactional()
	async createUserPageConversation(
		userId: Uuid,
		pageId: Uuid,
	): Promise<Conversation> {
		const existing = await this.convRepo
			.createQueryBuilder('c')
			.leftJoin('c.participants', 'p1')
			.leftJoin('c.participants', 'p2')
			.where('p1.user_id = :userId', { userId })
			.andWhere('p2.page_id = :pageId', { pageId })
			.groupBy('c.id')
			.having('COUNT(DISTINCT p1.id) = 1 AND COUNT(DISTINCT p2.id) = 1')
			.getOne();

		if (existing) return existing;

		const user = await this.usersService.findOne({ id: userId });
		const page = await this.pageService.findOne({ id: pageId });
		if (!user || !page) throw new NotFoundException();

		const conv = this.convRepo.create({
			isGroup: false,
			participants: [],
		});
		const saved = await this.convRepo.save(conv);

		const [pu, pp] = this.participantRepo.create([
			{ conversation: saved, user },
			{ conversation: saved, page },
		]);

		await this.participantRepo.save([pu, pp]);

		const conversation = await this.convRepo.findOne({
			where: { id: saved.id },
			relations: ['participants', 'participants.user', 'lastMessage'],
		});

		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.user).filter(Boolean),
		);
		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.page).filter(Boolean),
		);

		return conversation;
	}

	@Transactional()
	async createUserUserConversation(
		userId1: Uuid,
		userId2: Uuid,
	): Promise<Conversation> {
		if (userId1 === userId2)
			throw new BadRequestException(
				'Không thể tạo cuộc trò chuyện với chính mình',
			);

		const users = await this.usersService.getUsersByIds([userId1, userId2]);
		if (users.length !== 2)
			throw new NotFoundException('User không tồn tại đầy đủ');

		const existing = await this.convRepo
			.createQueryBuilder('c')
			.leftJoin('c.participants', 'p')
			.where('c.is_group = false')
			.where('p.page_id IS NULL')
			.groupBy('c.id')
			.having('COUNT(p.id) = 2')
			.andHaving(`bool_and(p.user_id IN (:...ids))`, {
				ids: [userId1, userId2],
			})
			.getOne();

		console.log({ existing });

		if (existing) return existing;

		const conv = this.convRepo.create({ isGroup: false });
		const saved = await this.convRepo.save(conv);

		const participants = users.map((user) =>
			this.participantRepo.create({ conversation: saved, user }),
		);
		await this.participantRepo.save(participants);

		const conversation = await this.convRepo.findOne({
			where: { id: saved.id },
			relations: ['participants', 'participants.user', 'lastMessage'],
		});

		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.user).filter(Boolean),
		);

		return conversation;
	}

	@Transactional()
	async createGroupConversation(userIds: Uuid[]): Promise<Conversation> {
		const users = await this.usersService.getUsersByIds(userIds);
		if (users.length !== userIds.length) {
			throw new BadRequestException('User không tồn tại đầy đủ.');
		}

		const qb = this.convRepo
			.createQueryBuilder('c')
			.leftJoin('c.participants', 'p')
			.where('c.isGroup = true')
			.groupBy('c.id')
			.having('COUNT(p.id) = :length', { length: userIds.length })
			.andHaving(`bool_and(p.user_id IN (:...ids))`, { ids: userIds });

		const existing = await qb.getOne();
		if (existing) return existing;

		const conv = this.convRepo.create({ isGroup: true });
		const saved = await this.convRepo.save(conv);

		const participants = users.map((user) =>
			this.participantRepo.create({ conversation: saved, user }),
		);
		await this.participantRepo.save(participants);

		const conversation = await this.convRepo.findOne({
			where: { id: saved.id },
			relations: ['participants', 'participants.user', 'lastMessage'],
		});

		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.user).filter(Boolean),
		);

		return conversation;
	}

	@Transactional()
	async createMessage(
		conversationId: Uuid,
		sender: { userId: Uuid; pageId?: Uuid },
		content: string,
	): Promise<Message> {
		const conv = await this.convRepo.findOneBy({ id: conversationId });
		if (!conv) throw new NotFoundException('Không tìm thấy cuộc trò chuyện');

		const user = await this.usersService.findOne({ id: sender.userId });
		if (!user) throw new NotFoundException('Người dùng không tồn tại');

		const message = this.msgRepo.create({
			conversation: conv,
			content,
			senderUser: user,
		});

		if (sender.pageId) {
			const { isMember, page } = await this.pageService.checkMember(
				sender.pageId,
				sender.userId,
			);
			if (!isMember)
				throw new BadRequestException(
					'Bạn không phải là thành viên của Page này',
				);

			message.senderPage = page;
		}

		const saved = await this.msgRepo.save(message);

		await this.assetsService.attachAssetToEntities([saved.senderUser]);
		if (saved.senderPage) {
			await this.assetsService.attachAssetToEntities([saved.senderPage]);
		}

		await this.convRepo.update(conversationId, {
			lastMessage: saved,
		});

		return saved;
	}

	async getGroupByQuery(
		query: string,
		currentUserId: Uuid,
	): Promise<Conversation[]> {
		const result = await this.convRepo
			.createQueryBuilder('c')
			.leftJoin('c.participants', 'p')
			.leftJoin('p.user', 'u')
			.leftJoin('p.page', 'pg')
			.where(
				'((LOWER(u.firstName) LIKE LOWER(:query) OR LOWER(u.lastName) LIKE LOWER(:query) OR LOWER(pg.name) LIKE LOWER(:query)) OR (LOWER(c.name) LIKE LOWER(:query)))',
				{ query: `%${query}%` },
			)
			.leftJoinAndSelect('c.participants', 'participants')
			.leftJoinAndSelect('participants.user', 'participantUser')
			.leftJoinAndSelect('participants.page', 'participantPage')
			.leftJoinAndSelect('c.lastMessage', 'lastMessage')
			.andWhere(
				'EXISTS (SELECT 1 FROM participants p2 WHERE p2.conversation_id = c.id AND (p2.user_id != :currentUserId OR p2.user_id IS NULL))',
				{ currentUserId },
			)
			.getMany();

		await this.assetsService.attachAssetToEntities(
			result.flatMap((c) => c.participants.map((p) => p.user)).filter(Boolean),
		);
		await this.assetsService.attachAssetToEntities(
			result.flatMap((c) => c.participants.map((p) => p.page)).filter(Boolean),
		);

		return result;
	}

	async getUserConversations(userId: Uuid, limit = 10, cursor?: Date) {
		const qb = this.convRepo
			.createQueryBuilder('c')
			.innerJoin('c.participants', 'p', 'p.user_id = :userId', { userId })
			.leftJoinAndSelect('c.lastMessage', 'lastMessage')
			.leftJoinAndSelect('c.participants', 'participants')
			.leftJoinAndSelect('participants.user', 'participantUser')
			.leftJoinAndSelect('participants.page', 'participantPage')
			.orderBy('c.updatedAt', 'DESC')
			.limit(limit + 1);

		if (cursor) {
			qb.andWhere('c.updatedAt < :cursor', { cursor });
		}

		const conversations = await qb.getMany();
		const hasMore = conversations.length > limit;
		const trimmed = hasMore ? conversations.slice(0, limit) : conversations;

		const readStatuses = await this.readRepo.find({
			where: {
				user: { id: userId },
				conversation: In(trimmed.map((c) => c.id)),
			},
			relations: ['lastReadMessage', 'conversation'],
		});

		const result = trimmed.map((conv) => {
			const status = readStatuses.find((rs) => rs.conversation.id === conv.id);
			const readTo = status?.lastReadMessage?.id || null;
			const lastMsgId = conv.lastMessage?.id || null;

			return {
				...conv,
				isUnread: lastMsgId && lastMsgId !== readTo,
			};
		});
		await this.assetsService.attachAssetToEntities(
			conversations
				.flatMap((c) => c.participants.map((p) => p.user))
				.filter(Boolean),
		);
		await this.assetsService.attachAssetToEntities(
			conversations
				.flatMap((c) => c.participants.map((p) => p.page))
				.filter(Boolean),
		);

		return {
			items: result,
			hasMore,
			nextCursor: hasMore ? trimmed[trimmed.length - 1].updatedAt : null,
		};
	}

	async getUserConversation(userId: Uuid, conversationId: Uuid) {
		const conversation = await this.convRepo.findOne({
			where: { id: conversationId },
			relations: [
				'participants',
				'participants.user',
				'participants.page',
				'lastMessage',
			],
		});

		if (!conversation)
			throw new NotFoundException('Không tìm thấy cuộc trò chuyện');

		if (!conversation?.participants.some((p) => p.user?.id === userId)) {
			throw new ForbiddenException(
				'You are not a participant in this conversation',
			);
		}

		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.user).filter(Boolean),
		);
		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.page).filter(Boolean),
		);

		return conversation;
	}

	async getPageConversations(
		pageId: Uuid,
		userId: Uuid,
		limit = 10,
		cursor?: Date,
	) {
		const { isMember } = await this.pageService.checkMember(pageId, userId);
		if (!isMember)
			throw new NotFoundException('Bạn không phải là thành viên của Page này');

		const qb = this.convRepo
			.createQueryBuilder('c')
			.innerJoin('c.participants', 'p', 'p.page_id = :pageId', { pageId })
			.leftJoinAndSelect('c.lastMessage', 'lastMessage')
			.leftJoinAndSelect('c.participants', 'participants')
			.leftJoinAndSelect('participants.user', 'participantUser')
			.leftJoinAndSelect('participants.page', 'participantPage')
			.orderBy('c.updatedAt', 'DESC')
			.limit(limit + 1);

		if (cursor) {
			qb.andWhere('c.updatedAt < :cursor', { cursor });
		}

		const conversations = await qb.getMany();
		const hasMore = conversations.length > limit;
		const trimmed = hasMore ? conversations.slice(0, limit) : conversations;

		const readStatuses = await this.readRepo.find({
			where: {
				user: { id: userId },
				conversation: In(trimmed.map((c) => c.id)),
			},
			relations: ['lastReadMessage', 'conversation'],
		});

		const result = trimmed.map((conv) => {
			const status = readStatuses.find((rs) => rs.conversation?.id === conv.id);
			const readTo = status?.lastReadMessage?.id || null;
			const lastMsgId = conv.lastMessage?.id || null;

			return {
				...conv,
				isUnread: lastMsgId && lastMsgId !== readTo,
			};
		});
		await this.assetsService.attachAssetToEntities(
			conversations
				.flatMap((c) => c.participants.map((p) => p.user))
				.filter(Boolean),
		);
		await this.assetsService.attachAssetToEntities(
			conversations
				.flatMap((c) => c.participants.map((p) => p.page))
				.filter(Boolean),
		);
		return {
			items: result,
			hasMore,
			nextCursor: hasMore ? trimmed[trimmed.length - 1].updatedAt : null,
		};
	}

	async getPageConversation(pageId: Uuid, userId: Uuid, conversationId: Uuid) {
		const { isMember } = await this.pageService.checkMember(pageId, userId);
		if (!isMember)
			throw new NotFoundException('Bạn không phải là thành viên của Page này');

		const conversation = await this.convRepo.findOne({
			where: { id: conversationId },
			relations: [
				'participants',
				'participants.page',
				'participants.user',
				'lastMessage',
			],
		});

		if (!conversation)
			throw new NotFoundException('Không tìm thấy cuộc trò chuyện');

		if (!conversation.participants.some((p) => p.page?.id === pageId)) {
			throw new ForbiddenException(
				'You are not a participant in this conversation',
			);
		}

		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.page).filter(Boolean),
		);
		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.user).filter(Boolean),
		);

		return conversation;
	}

	async getMessages(
		userId: Uuid,
		pageId: Uuid | null,
		conversationId: Uuid,
		limit = 20,
		cursor?: Date,
	): Promise<{
		items: Message[];
		hasMore: boolean;
		nextCursor: Date | null;
	}> {
		if (pageId) {
			const { isMember } = await this.pageService.checkMember(pageId, userId);
			if (!isMember)
				throw new NotFoundException(
					'Bạn không phải là thành viên của Page này',
				);
		} else {
			const isValid = await this.participantRepo.findOne({
				where: {
					user: { id: userId },
					conversation: { id: conversationId },
				},
			});

			if (!isValid)
				throw new NotFoundException('Không tìm thấy cuộc trò chuyện');
		}

		const qb = this.msgRepo
			.createQueryBuilder('m')
			.where('m.conversation_id = :conversationId', { conversationId })
			.leftJoinAndSelect('m.senderUser', 'senderUser')
			.leftJoinAndSelect('m.senderPage', 'senderPage')
			.orderBy('m.createdAt', 'DESC')
			.limit(limit + 1);

		if (cursor) {
			qb.andWhere('m.createdAt < :cursor', { cursor });
		}

		const messages = await qb.getMany();

		const hasMore = messages.length > limit;
		const trimmed = hasMore ? messages.slice(0, limit) : messages;

		await this.assetsService.attachAssetToEntities(
			messages.map((m) => m.senderUser).filter(Boolean),
		);
		await this.assetsService.attachAssetToEntities(
			messages.map((m) => m.senderPage).filter(Boolean),
		);

		return {
			items: trimmed.reverse(),
			hasMore,
			nextCursor: hasMore ? trimmed[0].createdAt : null,
		};
	}

	async findConversationById(id: Uuid): Promise<Conversation> {
		const conv = await this.convRepo.findOne({
			where: { id },
			relations: [
				'participants',
				'lastMessage',
				'participants.user',
				'participants.page',
			],
		});
		if (!conv) throw new NotFoundException('Không tìm thấy cuộc trò chuyện');
		return conv;
	}

	async markAsRead(conversationId: Uuid, userId: Uuid, messageId: Uuid) {
		const [conversation, user, message] = await Promise.all([
			this.convRepo.findOneBy({ id: conversationId }),
			this.usersService.findOne({ id: userId }),
			this.msgRepo.findOneBy({ id: messageId }),
		]);

		if (!conversation || !user || !message) throw new NotFoundException();

		let status = await this.readRepo.findOne({
			where: { user: { id: userId }, conversation: { id: conversationId } },
		});

		if (!status) {
			status = this.readRepo.create({
				user,
				conversation,
				lastReadMessage: message,
			});
		} else {
			status.lastReadMessage = message;
		}

		const saved = await this.readRepo.save(status);
	}

	async getConversationFormUserIds(userIds: Uuid[]) {
		const temp = await this.convRepo
			.createQueryBuilder('conv')
			.leftJoin('conv.participants', 'p')
			.leftJoin('p.user', 'u')
			.where('p.page IS NULL')
			.andWhere('u.id IN (:...userIds)', { userIds })
			.groupBy('conv.id')
			.having('COUNT(DISTINCT u.id) = :count', { count: userIds.length })
			.andHaving(
				'COUNT(DISTINCT u.id) = (SELECT COUNT(p2.id) FROM participants p2 WHERE p2.conversation_id = conv.id)',
			)
			.getOne();

		if (!temp) return null;

		const conversation = await this.convRepo.findOne({
			where: { id: temp.id },
			relations: ['participants', 'participants.user', 'lastMessage'],
		});

		await this.assetsService.attachAssetToEntities(
			conversation.participants.map((p) => p.user).filter(Boolean),
		);

		return conversation;
	}

	async getPermissionAccess(conversationId: Uuid, userId: Uuid, pageId?: Uuid) {
		const conversation = await this.convRepo.findOne({
			where: { id: conversationId },
			relations: ['participants', 'participants.user', 'participants.page'],
		});

		if (!conversation) return null;

		if (pageId) {
			const { isMember } = await this.pageService.checkMember(pageId, userId);
			if (!isMember) return null;

			if (conversation.participants.some((p) => p.page?.id === pageId)) {
				return conversation;
			}
		}

		if (conversation.participants.some((p) => p.user?.id === userId)) {
			return conversation;
		}

		return null;
	}
}
