import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { RoleTypePage } from '../../constants/role-type';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { PageUserEntity } from '../pages/entities/page-user.entity';
import { User } from '../users/entities/user.entity';

import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { RecruitmentPostEntity } from './entities/recruitment_post.entity';

@Injectable()
export class RecruitmentPostsService {
	constructor(
		@InjectRepository(RecruitmentPostEntity)
		private readonly recruitmentPostRepo: Repository<RecruitmentPostEntity>,
		@InjectRepository(PageUserEntity)
		private readonly pageUserRepo: Repository<PageUserEntity>,
		@InjectRepository(ApplicationEntity)
		private readonly applicationRepo: Repository<ApplicationEntity>,
	) {}

	async getAllPosts(
		pageOptionsDto: PageOptionsDto,
	): Promise<[RecruitmentPostEntity[], number]> {
		const queryBuilder = this.recruitmentPostRepo.createQueryBuilder('post');

		const { active = true } = pageOptionsDto;

		queryBuilder
			.leftJoinAndSelect('post.pageUser', 'pageUser')
			.leftJoinAndSelect('pageUser.user', 'user')
			.leftJoinAndSelect('pageUser.page', 'page')
			.where('post.active = :active', { active })
			.andWhere('pageUser.active = :pageUserActive', { pageUserActive: true })
			.orderBy('post.createdAt', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const [items, itemCount] = await queryBuilder.getManyAndCount();

		// const pageMetaDto = new PageMetaDto({
		// 	itemCount,
		// 	pageOptionsDto,
		// });

		return [items, itemCount];
	}

	async getRecruitmentPost(id: string): Promise<RecruitmentPostEntity> {
		const post = await this.recruitmentPostRepo.findOne({
			where: { id: id as Uuid },
			relations: ['pageUser', 'pageUser.user', 'pageUser.page'],
		});

		if (!post) {
			throw new NotFoundException('Recruitment post not found');
		}

		return post;
	}

	async createPost(
		user: User,
		post: CreateRecruitmentPostDto,
	): Promise<RecruitmentPostEntity> {
		const pageUser = await this.pageUserRepo.findOne({
			where: {
				user: { id: user.id },
				page: { id: post.pageId },
				role: RoleTypePage.ADMIN || RoleTypePage.OPERATOR,
				active: true,
			},
			relations: ['page', 'user'],
		});

		if (!pageUser) {
			throw new NotFoundException(
				'Page not found or you do not have access to this page',
			);
		}

		const { pageId, ...postData } = post;

		const newPost = this.recruitmentPostRepo.create({
			...postData,
			active: true,
			pageUser: pageUser,
		});

		const savedPost = await this.recruitmentPostRepo.save(newPost);
		return savedPost;
	}

	async getPostsByPageId(
		pageId: string,
		pageOptionsDto: PageOptionsDto,
	): Promise<{
		items: RecruitmentPostEntity[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = this.recruitmentPostRepo.createQueryBuilder('post');

		const { active = true } = pageOptionsDto;

		queryBuilder
			.leftJoinAndSelect('post.pageUser', 'pageUser')
			.leftJoinAndSelect('pageUser.user', 'user')
			.leftJoinAndSelect('pageUser.page', 'page')
			.andWhere('pageUser.active = :pageUserActive', { pageUserActive: true })
			.andWhere('page.id = :pageId', { pageId })
			.orderBy('post.createdAt', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const [items, pageMeta] = await queryBuilder.paginate(pageOptionsDto);

		return {
			items,
			meta: pageMeta,
		};
	}

	async getUserApplications(
		user: User,
		postId: Uuid,
		pageOptionsDto: PageOptionsDto,
	): Promise<[ApplicationEntity[], number]> {
		const queryBuilder = this.applicationRepo.createQueryBuilder('application');

		queryBuilder
			.leftJoinAndSelect('application.recruitmentPost', 'recruitmentPost')
			.leftJoinAndSelect('recruitmentPost.pageUser', 'pageUser')
			.andWhere('recruitmentPost.id = :postId', { postId })
			.orderBy('application.createdAt', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const [items, itemCount] = await queryBuilder.getManyAndCount();

		return [items, itemCount];
	}

	async getApplicationsByPostId(
		user: User,
		postId: string,
		pageOptionsDto: PageOptionsDto,
	): Promise<{
		items: ApplicationEntity[];
		meta: PageMetaDto;
	}> {
		// First check if the post exists and get its pageId
		const post = await this.recruitmentPostRepo.findOne({
			where: { id: postId as Uuid },
			relations: ['pageUser', 'pageUser.page'],
		});

		if (!post) {
			throw new NotFoundException('Recruitment post not found');
		}

		// Check if user is admin/operator of the page
		const pageUser = await this.pageUserRepo.findOne({
			where: {
				user: { id: user.id },
				page: { id: post.pageUser.page.id },
				role: In([RoleTypePage.ADMIN, RoleTypePage.OPERATOR]),
				active: true,
			},
		});

		if (!pageUser) {
			throw new NotFoundException(
				'You do not have permission to view applications for this post',
			);
		}

		const queryBuilder = this.applicationRepo.createQueryBuilder('application');

		queryBuilder
			.leftJoinAndSelect('application.user', 'user')
			.leftJoinAndSelect('application.recruitmentPost', 'post')
			.where('post.id = :postId', { postId })
			.orderBy('application.createdAt', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const [items, pageMeta] = await queryBuilder.paginate(pageOptionsDto);

		return {
			items,
			meta: pageMeta,
		};
	}
}
