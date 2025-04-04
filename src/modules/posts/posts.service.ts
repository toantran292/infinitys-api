import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssetsService, FileType } from '../assets/assets.service';
import { CreateAssetDto } from '../assets/dto/create-asset.dto';
import { REACT_TARGET_TYPE } from '../reacts/dto/create-react.dto';
import { ReactsService } from '../reacts/reacts.services';
import { User } from '../users/entities/user.entity';
import { NewsfeedService } from '../newsfeed/newsfeed.service';

import { CreatePostDto } from './dto/create-post.dto';
import { PostStatistics } from './entities/post-statistics.entity';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostEntity)
		private postRepository: Repository<PostEntity>,

		@InjectRepository(PostStatistics)
		private readonly postStatisticsRepository: Repository<PostStatistics>,

		private readonly assetsService: AssetsService,

		private readonly reactsService: ReactsService,

		private readonly newsfeedService: NewsfeedService,
	) {}

	async createPost(author: User, createPostDto: CreatePostDto) {
		const { content } = createPostDto;

		const post = this.postRepository.create({
			content,
			author,
		});

		const savedPost = await this.postRepository.save(post);

		if (createPostDto.images) {
			await this.assetsService.addAssetsToEntity(
				savedPost,
				createPostDto.images.map((image) => ({
					type: `${FileType.IMAGE}s`,
					file_data: image,
				})),
			);
		}

		// Thêm bài viết vào newsfeed của tác giả và bạn bè
		await this.newsfeedService.distributePost(savedPost);

		return savedPost;
	}

	async getPosts() {
		return await this.postRepository.find({
			relations: ['author'],
		});
	}

	async getPostByUserId(userId: Uuid) {
		const queryBuilder = this.postRepository.createQueryBuilder('post');

		queryBuilder
			.leftJoinAndSelect('post.author', 'author')
			.leftJoinAndMapOne(
				'post.statistics',
				PostStatistics,
				'stats',
				'stats.postId = post.id',
			)
			.where('author.id = :userId', { userId })
			.orderBy('post.createdAt', 'DESC');

		const posts = await queryBuilder.getMany();

		await this.assetsService.attachAssetToEntities(
			posts.map((post) => post.author),
		);

		await this.assetsService.attachAssetToEntities(posts);

		return posts;
	}

	async react(user: User, postId: Uuid) {
		const post = await this.postRepository.findOne({ where: { id: postId } });
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		const react = await this.reactsService.createReact(user, {
			targetId: postId,
			targetType: REACT_TARGET_TYPE.POST,
		});

		return react;
	}

	async getNewsfeed(
		userId: Uuid,
		options?: { page?: number; limit?: number; lastId?: string },
	) {
		// Sử dụng newsfeedService để lấy newsfeed
		return await this.newsfeedService.getNewsfeed(userId, {
			page: options?.page || 1,
			limit: options?.limit || 10,
			lastId: options?.lastId,
		});
	}

	async uploadImages(user: User, postId: Uuid, images: CreateAssetDto[]) {
		const post = await this.postRepository.findOne({
			where: { id: postId, author: { id: user.id } },
		});
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		return await this.assetsService.addAssetsToEntity(
			post,
			images.map((i) => {
				return {
					type: `${FileType.IMAGE}s`,
					file_data: i,
				};
			}),
		);
	}
}
