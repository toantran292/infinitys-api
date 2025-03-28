import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageStatus } from '../../constants/page-status';
import { RoleTypePage } from '../../constants/role-type';
import { AssetsService, FileType } from '../assets/assets.service';
import { AssetEntity } from '../assets/entities/asset.entity';
import { AvatarDto } from '../users/dto/avatar.dto';
import { User } from '../users/entities/user.entity';

import { RegisterPageDto } from './dto/create-page.dto';
import { PageUserEntity } from './entities/page-user.entity';
import { Page } from './entities/page.entity';

import type { PagePageOptionsDto } from './dto/page-page-options.dto';
import { SearchService } from '../search/search.service';
import { AdminUpdatePageDto, UpdatePageDto } from './dto/update-page.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { RecruitmentPostsService } from '../recruitment_posts/recruitment_posts.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
@Injectable()
export class PagesService {
	constructor(
		@InjectRepository(Page)
		private readonly pageRepository: Repository<Page>,
		@InjectRepository(PageUserEntity)
		private readonly pageUserRepository: Repository<PageUserEntity>,

		@InjectRepository(AssetEntity)
		private readonly assetRepository: Repository<AssetEntity>,
		private readonly assetsService: AssetsService,

		private readonly searchService: SearchService,
		private readonly notificationService: NotificationsService,
		private readonly recruitmentPostsService: RecruitmentPostsService,
	) {}

	findOne(findData: FindOptionsWhere<Page>): Promise<Page | null> {
		return this.pageRepository.findOneBy(findData);
	}

	async checkMember(
		pageId: Uuid,
		userId: Uuid,
	): Promise<{
		isMember: boolean;
		page: Page;
		user: User;
	}> {
		const pageUser = await this.pageUserRepository.findOne({
			where: {
				page: { id: pageId },
				user: { id: userId },
			},
			relations: ['page', 'user'],
		});
		return {
			isMember: !!pageUser,
			page: pageUser?.page,
			user: pageUser?.user,
		};
	}

	async getPage(pageId: Uuid) {
		return this.pageRepository.findOne({
			where: { id: pageId },
		});
	}

	async getPages(
		pagePageOptionsDto: PagePageOptionsDto,
		require_approve: boolean = true,
	): Promise<{
		items: Page[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = await this.pageRepository.createQueryBuilder('page');

		if (require_approve) {
			queryBuilder.andWhere('page.status = :status', {
				status: PageStatus.APPROVED,
			});
		}

		const [items, pageMeta] = await queryBuilder.paginate(pagePageOptionsDto);

		await this.assetsService.attachAssetToEntities(items);

		return {
			items,
			meta: pageMeta,
		};
	}

	async getPageById(user: User, pageId: Uuid): Promise<Page> {
		const _error = 'error.page_not_found';

		let page = await this.pageRepository.findOne({
			where: { id: pageId },
		});

		if (!page) {
			throw new BadRequestException(_error);
		}

		const userAdmin = await this.pageUserRepository
			.findOne({
				where: {
					page: { id: pageId },
					role: RoleTypePage.ADMIN,
				},
				relations: ['user'],
			})
			.then((pageUser) => pageUser?.user);

		if (page.status !== PageStatus.APPROVED) {
			if (userAdmin.id !== user.id) {
				throw new BadRequestException(_error);
			}
		}

		page = await this.assetsService.attachAssetToEntity(page);

		page.admin_user_id = userAdmin.id;

		return page;
	}

	async getMyPages(
		user: User,
		pagePageOptionsDto: PagePageOptionsDto,
	): Promise<{
		items: Page[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = this.pageRepository
			.createQueryBuilder('page')
			.select()
			.innerJoin('page.pageUsers', 'pageUsers')
			.where('pageUsers.user_id = :userId', { userId: user.id })
			.andWhere('pageUsers.role IN (:...roles)', {
				roles: [RoleTypePage.ADMIN, RoleTypePage.OPERATOR],
			})
			.searchByString(pagePageOptionsDto.q, ['name'])
			.orderBy('page.createdAt', 'DESC');

		const [items, pageMeta] = await queryBuilder.paginate(pagePageOptionsDto);

		await this.assetsService.attachAssetToEntities(items);

		return {
			items,
			meta: pageMeta,
		};
	}

	async getWorkingPage(
		user: User,
		options: {
			role?: RoleTypePage[];
		},
	) {
		const pageUsers = await this.pageUserRepository.find({
			where: {
				user: { id: user.id },
				page: { status: PageStatus.APPROVED },
				active: true,
				role: options.role ? In(options.role) : undefined,
			},
			relations: ['page'],
			order: {
				createdAt: 'DESC',
			},
		});

		const pages = pageUsers.map((pageUser) => {
			pageUser.page.pageRole = pageUser.role;
			return pageUser.page;
		});

		return pages;
	}

	@Transactional()
	async registerPage(
		user: User,
		registerPageDto: RegisterPageDto,
	): Promise<Page> {
		const existingPage = await this.pageRepository.findOne({
			where: { email: registerPageDto.email },
		});

		if (existingPage && existingPage.status !== PageStatus.REJECTED) {
			throw new BadRequestException('Page is already registered');
		}

		const page =
			existingPage ||
			this.pageRepository.create({
				name: registerPageDto.name,
				address: registerPageDto.address,
				url: registerPageDto.url,
				email: registerPageDto.email,
				content: registerPageDto.content,
				status: PageStatus.STARTED,
			});

		const savePage = await this.pageRepository.save(page);
		try {
			if (registerPageDto.avatar) {
				await this.assetRepository.save({
					type: FileType.AVATAR,
					owner_type: 'pages',
					owner_id: savePage.id,
					file_data: registerPageDto.avatar,
				});
			}
		} catch (error) {
			console.error('❌ Lỗi khi lưu avatar:', error);
			throw new BadRequestException('Lỗi khi lưu avatar');
		}

		const pageUserData = { page, user, role: RoleTypePage.ADMIN };
		const existingPageUser = await this.pageUserRepository
			.createQueryBuilder('pageUser')
			.where('pageUser.page_id = :pageId', { pageId: page.id })
			.andWhere('pageUser.user_id = :userId', { userId: user.id })
			.andWhere('pageUser.role = :role', { role: RoleTypePage.ADMIN })
			.getOne();

		if (!existingPageUser) {
			const pageUser = this.pageUserRepository.create(pageUserData);

			await this.pageUserRepository.save(pageUser);
		}

		return page;
	}

	async reRegisterPage(user: User, pageId: Uuid) {
		const result = await this.pageUserRepository.findOne({
			where: {
				page: { id: pageId },
				user: { id: user.id },
				role: RoleTypePage.ADMIN,
			},
			relations: ['page'],
		});

		if (!result) {
			throw new BadRequestException('Page not found');
		}

		if (result.page.status !== PageStatus.REJECTED) {
			throw new BadRequestException('Page is not rejected');
		}

		result.page.status = PageStatus.STARTED;
		await this.pageRepository.save(result.page);

		return result.page;
	}

	async getUsers(pageId: Uuid, pagePageOptionsDto: PagePageOptionsDto) {
		const queryBuilder = this.pageUserRepository.createQueryBuilder('pageUser');

		queryBuilder.where('pageUser.page_id = :pageId', { pageId });
		queryBuilder.leftJoinAndSelect('pageUser.user', 'user');

		const [items, pageMeta] = await queryBuilder.paginate(pagePageOptionsDto);

		items.forEach((item) => {
			item.user.pageRole = item.role;
		});

		const users = items.map((item) => item.user);

		return {
			items: users,
			meta: pageMeta,
		};
	}

	async approvePage(pageId: Uuid) {
		const pageUser = await this.pageUserRepository.findOne({
			where: {
				page: { id: pageId },
				role: RoleTypePage.ADMIN,
			},
			relations: ['page', 'user'],
		});

		if (!pageUser) {
			throw new Error('Page not found');
		}

		pageUser.page.status = PageStatus.APPROVED;
		await this.pageRepository.save(pageUser.page);

		this.assetsService.attachAssetToEntity(pageUser.page);

		this.searchService.indexPage({
			address: pageUser.page.address,
			content: pageUser.page.content,
			email: pageUser.page.email,
			id: pageUser.page.id,
			name: pageUser.page.name,
			url: pageUser.page.url,
			avatar: {
				key: pageUser.page.avatar?.file_data.key,
			},
		});

		this.notificationService.sendNotificationToUser({
			userId: pageUser.user.id,
			data: {
				event_name: 'page:approved',
				meta: {
					pageId,
				},
			},
		});

		return pageUser.page;
	}

	async rejectPage(pageId: Uuid) {
		const pageUser = await this.pageUserRepository.findOne({
			where: {
				page: { id: pageId },
				role: RoleTypePage.ADMIN,
			},
			relations: ['page', 'user'],
		});

		if (!pageUser) {
			throw new Error('Page not found');
		}

		pageUser.page.status = PageStatus.REJECTED;
		await this.pageRepository.save(pageUser.page);

		this.searchService.removePage(pageId);

		this.notificationService.sendNotificationToUser({
			userId: pageUser.user.id,
			data: {
				event_name: 'page:rejected',
				meta: {
					pageId,
				},
			},
		});

		return {
			message: 'Page request rejected',
			reason: 'Information is incorrect or missing',
		};
	}

	public async updateAvatarPage(page_id: Uuid, avatar: AvatarDto) {
		const page = await this.pageRepository.findOne({
			where: {
				id: page_id,
			},
		});

		await this.assetsService.addAssetToEntity(page, {
			type: FileType.AVATAR,
			file_data: avatar,
		});

		if(page.status === PageStatus.APPROVED) {
			this.searchService.indexPage({
				address: page.address,
				content: page.content,
				email: page.email,
				id: page.id,
			name: page.name,
			avatar: {
					key: avatar.key,
				},
				url: page.url,
			});
		}
	}

	async updatePage(
		pageId: Uuid,
		updatePageDto: UpdatePageDto | AdminUpdatePageDto,
	) {
		const page = await this.pageRepository.findOne({
			where: { id: pageId },
		});

		if (!page) {
			throw new Error('Page not found');
		}

		const { avatar, ...rest } = updatePageDto;

		Object.assign(page, rest);

		const updatedPage = await this.pageRepository.save(page);

		await this.assetsService.attachAssetToEntity(updatedPage);

		if(updatedPage.status === PageStatus.APPROVED) {
			this.searchService.indexPage({
				address: updatedPage.address,
				content: updatedPage.content,
				email: updatedPage.email,
				id: updatedPage.id,
				name: updatedPage.name,
			url: updatedPage.url,
			avatar: {
					key: updatedPage.avatar?.file_data.key,
				},
			});
		}

		return updatedPage;
	}

	async getApplicationsByPostId(
		user: User,
		pageId: Uuid,
		postId: Uuid,
		pageOptionsDto: PageOptionsDto,
	) {
		const pageUser = await this.pageUserRepository.findOne({
			where: {
				user: { id: user.id },
				page: { id: pageId },
				role: In([RoleTypePage.ADMIN, RoleTypePage.OPERATOR]),
				active: true,
			},
		});

		if (!pageUser) {
			throw new Error('You are not authorized to view this page');
		}

		return this.recruitmentPostsService.getApplicationsByPostId(
			postId,
			pageOptionsDto,
		);
	}
}
