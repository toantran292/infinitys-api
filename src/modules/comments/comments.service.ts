import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { AssetsService } from '../assets/assets.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PostStatistics } from '../posts/entities/post-statistics.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { ReactEntity } from '../reacts/entities/react.entity';
import { User } from '../users/entities/user.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentStatistics } from './entities/comment-statistics.entity';
import { CommentEntity } from './entities/comment.entity';
import { ReactStatus } from './interfaces/react-status.interface';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>,
		@InjectRepository(PostEntity)
		private readonly postRepository: Repository<PostEntity>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(CommentStatistics)
		private readonly commentStatisticsRepository: Repository<CommentStatistics>,
		@InjectRepository(ReactEntity)
		private readonly reactRepository: Repository<ReactEntity>,
		private readonly assetsService: AssetsService,
		@InjectRepository(PostStatistics)
		private readonly postStatisticsRepository: Repository<PostStatistics>,
		private readonly notificationService: NotificationsService,
	) {}

	@Transactional()
	async createComment(user: User, createCommentDto: CreateCommentDto) {
		const { content, postId } = createCommentDto;

		const post = await this.postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.author', 'author')
			.where('post.id = :postId', { postId })
			.getOne();

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		const comment = this.commentRepository.create({
			content,
			post: { id: post.id },
			user: { id: user.id },
		});

		const savedComment = await this.commentRepository.save(comment);

		if (post.author.id !== user.id) {
			this.notificationService.sendNotificationToUser({
				userId: post.author.id,
				data: {
					event_name: 'comment:created',
					meta: {
						commenterId: user.id,
						content: savedComment.content,
					},
				},
			});
		}

		return savedComment;
	}

	async getCommentsByPostId(postId: Uuid) {
		const queryBuilder = this.commentRepository.createQueryBuilder('comment');

		queryBuilder
			.leftJoinAndSelect('comment.user', 'user')
			.leftJoinAndSelect('comment.post', 'post')
			.leftJoinAndMapOne(
				'comment.statistics',
				CommentStatistics,
				'stats',
				'stats.comment_id = comment.id',
			)
			.where('post.id = :postId', { postId })
			.orderBy('comment.createdAt', 'DESC');

		const comments = await queryBuilder.getMany();

		await this.assetsService.attachAssetToEntities(
			comments.map((comment) => comment.user),
		);

		return comments;
	}

	async getCommentReactStatus(
		user: User,
		commentId: Uuid,
	): Promise<ReactStatus> {
		const comment = await this.commentRepository.findOne({
			where: { id: commentId },
			relations: ['statistics'],
		});

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		const isActive = await this.reactRepository
			.createQueryBuilder('react')
			.where('react.targetId = :commentId', { commentId })
			.andWhere('react.userId = :userId', { userId: user.id })
			.andWhere('react.isActive = true')
			.getExists();

		return {
			isActive,
			react_count: comment.statistics?.reactCount || 0,
		};
	}
}
