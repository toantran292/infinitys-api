import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NewsfeedItem } from './entities/newsfeed-item.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { FriendService } from '../users/friend.service';
import { PostStatistics } from '../posts/entities/post-statistics.entity';
import { AssetsService } from '../assets/assets.service';
import { NewsfeedGateway } from './newsfeed.gateway';
import { UsersService } from '../users/users.service';
@Injectable()
export class NewsfeedService {
	constructor(
		@InjectRepository(NewsfeedItem)
		private readonly newsfeedItemRepository: Repository<NewsfeedItem>,

		// @Inject(forwardRef(() => PostsService))
		@InjectRepository(PostEntity)
		private readonly postRepository: Repository<PostEntity>,

		@Inject(forwardRef(() => FriendService))
		private readonly friendService: FriendService,

		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,

		private readonly assetsService: AssetsService,
		private readonly newsfeedGateway: NewsfeedGateway,
	) {}

	/**
	 * Phân phối bài viết mới vào newsfeed của user và bạn bè
	 */
	async distributePost(post: PostEntity): Promise<void> {
		// Lấy tác giả của bài viết
		const author = post.author;

		// Lấy danh sách bạn bè của tác giả
		const friends = await this.friendService.getFriends(author.id);

		// Thêm bài viết vào newsfeed của chính tác giả
		await this.addToNewsfeed(author, post, 1.0); // Max rank cho bài viết của chính mình

		// Thêm bài viết vào newsfeed của bạn bè
		for (const friend of friends) {
			const edgeRank = await this.calculateInitialEdgeRank(
				post,
				author.id,
				friend.id,
			);
			await this.addToNewsfeed(friend, post, edgeRank);

			// Notify via WebSocket
			this.newsfeedGateway.notifyNewPost(friend.id, post);
		}
	}

	/**
	 * Thêm bài viết vào newsfeed của người dùng
	 */
	private async addToNewsfeed(
		user: User,
		post: PostEntity,
		edgeRank: number,
	): Promise<void> {
		const newsfeedItem = this.newsfeedItemRepository.create({
			user: user,
			userId: user.id,
			post: post,
			postId: post.id,
			edgeRank: edgeRank,
			isSeen: false,
		});

		await this.newsfeedItemRepository.save(newsfeedItem);
	}

	/**
	 * Tính EdgeRank ban đầu khi bài viết được tạo
	 */
	private async calculateInitialEdgeRank(
		post: PostEntity,
		authorId: string,
		userId: string,
	): Promise<number> {
		// 1. Affinity - Độ thân thiết giữa người dùng và tác giả
		const affinity = await this.calculateAffinity(userId, authorId);

		// 2. Weight - Trọng số của bài viết (dựa trên loại nội dung)
		const weight = this.calculateWeight(post);

		// 3. Time Decay - Luôn là 1 vì bài viết mới
		const timeDecay = 1;

		return affinity * weight * timeDecay;
	}

	/**
	 * Tính độ thân thiết giữa 2 người dùng
	 */
	private async calculateAffinity(
		userId: string,
		authorId: string,
	): Promise<number> {
		if (userId === authorId) return 1; // Bài viết của chính mình

		// TODO: Trong tương lai có thể tính dựa trên tần suất tương tác
		// Hiện tại chỉ cần kiểm tra là bạn bè
		const isFriend = await this.friendService.isFriend(userId, authorId);
		return isFriend ? 0.8 : 0;
	}

	/**
	 * Tính trọng số của bài viết
	 */
	private calculateWeight(post: PostEntity): number {
		// Trọng số cao hơn cho bài viết có hình ảnh
		const hasImages = post.images?.length > 0;
		const mediaScore = hasImages ? 0.3 : 0;

		// Trọng số dựa trên độ dài nội dung
		const contentLength = post.content?.length || 0;
		const contentScore = Math.min(contentLength / 1000, 0.2);

		return 0.5 + mediaScore + contentScore; // Base score 0.5
	}

	/**
	 * Lấy newsfeed của người dùng
	 */
	async getNewsfeed(
		userId: string,
		options: { page: number; limit: number; lastId?: string } = {
			page: 1,
			limit: 10,
		},
	) {
		const queryBuilder = this.newsfeedItemRepository
			.createQueryBuilder('newsfeedItem')
			.leftJoinAndSelect('newsfeedItem.post', 'post')
			.leftJoinAndSelect('post.author', 'author')
			.leftJoinAndMapOne(
				'post.statistics',
				PostStatistics,
				'stats',
				'stats.postId = post.id',
			)
			.where('newsfeedItem.userId = :userId', { userId })
			.orderBy('newsfeedItem.edgeRank', 'DESC')
			.addOrderBy('post.createdAt', 'DESC')
			.take(options.limit);

		// Infinity scroll logic
		if (options.lastId) {
			const lastItem = await this.newsfeedItemRepository.findOne({
				where: { id: options.lastId as Uuid },
				relations: ['post', 'user'],
			});

			if (lastItem) {
				queryBuilder.andWhere(
					'(newsfeedItem.edgeRank < :lastRank) OR ' +
						'(newsfeedItem.edgeRank = :lastRank AND post.createdAt < :lastCreatedAt)',
					{
						lastRank: lastItem.edgeRank,
						lastCreatedAt: lastItem.post.createdAt,
					},
				);
			}
		} else {
			queryBuilder.skip((options.page - 1) * options.limit);
		}

		const newsfeedItems = await queryBuilder.getMany();

		// Extract posts from newsfeed items
		const posts = newsfeedItems.map((item) => item.post);

		// Mark items as seen
		if (newsfeedItems.length > 0) {
			await this.newsfeedItemRepository.update(
				{
					id: In(newsfeedItems.map((item) => item.id)),
					isSeen: false,
				},
				{
					isSeen: true,
					seenAt: new Date(),
				},
			);
		}

		// Attach assets
		await this.assetsService.attachAssetToEntities(
			posts.map((post) => post.author),
		);
		await this.assetsService.attachAssetToEntities(posts);

		return {
			items: posts,
			hasMore: newsfeedItems.length === options.limit,
			nextCursor:
				newsfeedItems.length > 0
					? newsfeedItems[newsfeedItems.length - 1].id
					: null,
		};
	}

	/**
	 * Cập nhật định kỳ EdgeRank của các bài viết
	 * Có thể chạy như một scheduled task
	 */
	async updateEdgeRanks(): Promise<void> {
		const newsfeedItems = await this.newsfeedItemRepository.find({
			relations: ['post', 'user', 'post.author'],
		});

		await this.assetsService.attachAssetToEntities(
			newsfeedItems.map((item) => item.post),
		);

		for (const item of newsfeedItems) {
			// Cập nhật affinity và weight (có thể thay đổi theo thời gian)
			const affinity = await this.calculateAffinity(
				item.userId,
				item.post.author.id,
			);
			const weight = this.calculateWeight(item.post);

			// Tính time decay dựa trên thời gian tạo post
			const timeDecay = this.calculateTimeDecay(item.post.createdAt);

			// Cập nhật EdgeRank
			item.edgeRank = Number(affinity) * Number(weight) * Number(timeDecay);
			await this.newsfeedItemRepository.save(item);
		}
	}

	/**
	 * Tính độ giảm theo thời gian
	 */
	private calculateTimeDecay(createdAt: Date): number {
		const now = new Date();
		const diffInHours =
			(now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 1) return 1; // Dưới 1 giờ
		if (diffInHours < 24) return 0.8; // Dưới 1 ngày
		if (diffInHours < 72) return 0.5; // Dưới 3 ngày
		if (diffInHours < 168) return 0.3; // Dưới 1 tuần

		return 0.1;
	}

	/**
	 * Xử lý khi có bạn mới, thêm bài viết của họ vào newsfeed
	 */
	async handleNewFriendship(userId: Uuid, friendId: Uuid): Promise<void> {
		// Lấy các bài viết gần đây của người bạn mới (giới hạn 30 ngày)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const posts = await this.postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.author', 'author')
			.where('author.id = :friendId', { friendId })
			.andWhere('post.createdAt > :thirtyDaysAgo', { thirtyDaysAgo })
			.orderBy('post.createdAt', 'DESC')
			.getMany();

		if (posts.length === 0) return;

		// Tính EdgeRank và thêm vào newsfeed
		const user = await this.userService.findOne({ id: userId });

		await this.assetsService.attachAssetToEntities(posts);

		for (const post of posts) {
			// Tính EdgeRank
			const affinity = await this.calculateAffinity(userId, friendId);
			const weight = this.calculateWeight(post);
			const timeDecay = this.calculateTimeDecay(post.createdAt);
			const edgeRank = affinity * weight * timeDecay;

			// Kiểm tra xem đã có trong newsfeed chưa
			const existingItem = await this.newsfeedItemRepository.findOne({
				where: { userId, postId: post.id },
			});

			if (!existingItem) {
				// Thêm vào newsfeed
				await this.addToNewsfeed(user, post, edgeRank);
			}
		}
	}

	/**
	 * Xử lý khi hủy kết bạn, xóa bài viết của người đó khỏi newsfeed
	 */
	async handleUnfriend(userId: Uuid, exFriendId: Uuid): Promise<void> {
		// Tìm tất cả các bài viết của người đã hủy kết bạn trong newsfeed
		const newsfeedItems = await this.newsfeedItemRepository
			.createQueryBuilder('item')
			.leftJoinAndSelect('item.post', 'post')
			.leftJoinAndSelect('post.author', 'author')
			.where('item.userId = :userId', { userId })
			.andWhere('author.id = :exFriendId', { exFriendId })
			.getMany();

		if (newsfeedItems.length === 0) return;

		// Xóa các bài viết này khỏi newsfeed
		await this.newsfeedItemRepository.remove(newsfeedItems);
	}

	/**
	 * Tạo mới hoặc tái tạo newsfeed cho người dùng
	 */
	async rebuildNewsfeedForUser(userId: Uuid): Promise<void> {
		// Xóa tất cả các mục newsfeed hiện tại
		await this.newsfeedItemRepository.delete({ userId });

		// Lấy danh sách bạn bè
		const friends = await this.friendService.getFriends(userId);
		const friendIds = friends.map((friend) => friend.id);

		// Thêm chính người dùng vào danh sách
		friendIds.push(userId);

		// Lấy bài viết gần đây của tất cả bạn bè và người dùng (30 ngày)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const posts = await this.postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.author', 'author')
			.where('author.id IN (:...friendIds)', { friendIds })
			.andWhere('post.createdAt > :thirtyDaysAgo', { thirtyDaysAgo })
			.orderBy('post.createdAt', 'DESC')
			.getMany();

		await this.assetsService.attachAssetToEntities(posts);

		// Thêm từng bài viết vào newsfeed
		const user = await this.userService.findOne({ id: userId });

		for (const post of posts) {
			const affinity = await this.calculateAffinity(userId, post.author.id);
			const weight = this.calculateWeight(post);
			const timeDecay = this.calculateTimeDecay(post.createdAt);
			const edgeRank = affinity * weight * timeDecay;

			await this.addToNewsfeed(user, post, edgeRank);
		}
	}

	// Đánh dấu bài viết đã xem
	async markItemAsSeen(userId: Uuid, newsfeedItemId: Uuid): Promise<void> {
		await this.newsfeedItemRepository.update(
			{ id: newsfeedItemId, userId },
			{ isSeen: true, seenAt: new Date() },
		);
	}

	// Lấy số lượng bài viết mới chưa đọc
	async getNewPostsCount(userId: Uuid): Promise<number> {
		return this.newsfeedItemRepository.count({
			where: { userId, isSeen: false },
		});
	}

	// Lấy các bài viết mới nhất
	async getLatestPosts(userId: Uuid): Promise<any[]> {
		const lastSeenItem = await this.newsfeedItemRepository.findOne({
			where: { userId, isSeen: true },
			order: { createdAt: 'DESC' },
		});

		const queryBuilder = this.newsfeedItemRepository
			.createQueryBuilder('item')
			.leftJoinAndSelect('item.post', 'post')
			.leftJoinAndSelect('post.author', 'author')
			.where('item.userId = :userId', { userId });

		if (lastSeenItem) {
			queryBuilder.andWhere('item.createdAt > :lastSeenAt', {
				lastSeenAt: lastSeenItem.createdAt,
			});
		}

		queryBuilder.orderBy('post.createdAt', 'DESC');

		const items = await queryBuilder.getMany();
		return items.map((item) => item.post);
	}
}
