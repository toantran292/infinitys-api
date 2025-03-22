import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruitmentPostEntity } from './entities/recruitment_post.entity';
import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { UserEntity } from '../users/entities/user.entity';
import { PageUserEntity } from '../pages/entities/page-user.entity';
import { RoleTypePage } from 'src/constants/role-type';
import { RecruitmentPostDto } from './dto/recruitment-post.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { In } from 'typeorm';

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
	): Promise<PageDto<RecruitmentPostDto>> {
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

		const pageMetaDto = new PageMetaDto({
			itemCount,
			pageOptionsDto,
		});

		return new PageDto(
			items.map((item) => item.toDto()),
			pageMetaDto,
		);
	}

	async getRecruitmentPost(id: string): Promise<RecruitmentPostDto> {
		const post = await this.recruitmentPostRepo.findOne({
			where: { id: id as Uuid },
			relations: ['pageUser', 'pageUser.user', 'pageUser.page'],
		});

		if (!post) {
			throw new NotFoundException('Recruitment post not found');
		}

		return post.toDto<RecruitmentPostDto>();
	}

	async createPost(
		user: UserEntity,
		post: CreateRecruitmentPostDto,
	): Promise<RecruitmentPostDto> {
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
		return savedPost.toDto<RecruitmentPostDto>();
	}

	async getPostsByPageId(
		pageId: string,
		pageOptionsDto: PageOptionsDto,
	): Promise<PageDto<RecruitmentPostDto>> {
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

		const [items, itemCount] = await queryBuilder.getManyAndCount();

		const pageMetaDto = new PageMetaDto({
			itemCount,
			pageOptionsDto,
		});

		return new PageDto(
			items.map((item) => item.toDto()),
			pageMetaDto,
		);
	}

	async getUserApplications(
		user: UserEntity,
		postId: Uuid,
		pageOptionsDto: PageOptionsDto,
	): Promise<PageDto<ApplicationEntity>> {
		const queryBuilder = this.applicationRepo.createQueryBuilder('application');

		queryBuilder
			.leftJoinAndSelect('application.recruitmentPost', 'recruitmentPost')
			.leftJoinAndSelect('recruitmentPost.pageUser', 'pageUser')
			.andWhere('recruitmentPost.id = :postId', { postId })
			.orderBy('application.createdAt', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const [items, itemCount] = await queryBuilder.getManyAndCount();

		const pageMetaDto = new PageMetaDto({
			itemCount,
			pageOptionsDto,
		});

		return new PageDto(
			items.map((item) => item.toDto()),
			pageMetaDto,
		);
	}

	async getApplicationsByPostId(
		user: UserEntity,
		postId: string,
		pageOptionsDto: PageOptionsDto,
	): Promise<PageDto<ApplicationEntity>> {
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

		const [items, itemCount] = await queryBuilder.getManyAndCount();

		const pageMetaDto = new PageMetaDto({
			itemCount,
			pageOptionsDto,
		});

		return new PageDto(items, pageMetaDto);
	}
}
