import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PageUserEntity } from './entities/page-user.entity';
import { RegisterPageDto } from './dto/create-page.dto';
import { RoleType, RoleTypePage } from '../../constants/role-type';
import type { PagePageOptionsDto } from './dto/page-page-options.dto';
import type { PageDto as CommonPageDto } from '../../common/dto/page.dto';
import type { PageDto } from './dto/page.dto';
import { Transactional } from 'typeorm-transactional';

import { PageStatus } from '../../constants/page-status';
import { AssetsService, FileType } from '../assets/assets.service';
import { AssetEntity } from '../assets/entities/asset.entity';
import { AvatarDto } from '../users/dto/avatar.dto';
import { User } from '../users/entities/user.entity';
import { Page } from './entities/page.entity';
import { SearchService } from '../search/search.service';
import { FollowEntity } from './entities/follow.entity';

// import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
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

		@InjectRepository(FollowEntity)
		private readonly followRepository: Repository<FollowEntity>,

		private readonly searchService: SearchService,
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

	async getPages(pagePageOptionsDto: PagePageOptionsDto): Promise<{
		items: Page[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = await this.pageRepository
			.createQueryBuilder('page')
			.where('page.status = :status', { status: PageStatus.APPROVED });

		const [items, pageMeta] = await queryBuilder.paginate(pagePageOptionsDto);

		await this.assetsService.attachAssetToEntities(items);
		console.log(items);
		return {
			items,
			meta: pageMeta,
		};
	}

	async getPendingPages(pagePageOptionsDto: PagePageOptionsDto): Promise<{
		items: Page[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = await this.pageRepository
			.createQueryBuilder('page')

		const [items, pageMeta] = await queryBuilder.paginate(pagePageOptionsDto);

		await this.assetsService.attachAssetToEntities(items);

		return {
			items,
			meta: pageMeta,
		};
	}
	async getPageById(user: User, pageId: Uuid){
		const _error = 'error.page_not_found';

		let page = await this.pageRepository.findOne({
			where: { id: pageId },
			relations: ['pageUsers'],
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
			if (userAdmin.id !== user.id && user.role !== RoleType.ADMIN) {
				throw new BadRequestException(_error);
			}
		}
		const followRecords = await this.followRepository.find({
			where: { page: { id: pageId } },
			relations: ['user'],
		});
		const isFollowing = followRecords.some(
			(follow) => follow.user.id === user.id,
		);

		page = await this.assetsService.attachAssetToEntity(page);

		page.admin_user_id = userAdmin.id;

		return { ...page, isFollowing };
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
		console.log(items);
		return {
			items,
			meta: pageMeta,
		};
	}

	@Transactional()
	async registerPage(
		user: User,
		registerPageDto: RegisterPageDto,
	): Promise<Page> {
		const existingPage = await this.pageRepository.findOne({
			where: { email: registerPageDto.email },
		});

		if (existingPage) {
			if (existingPage.status !== PageStatus.REJECTED) {
				throw new BadRequestException('Page is already registered');
			} else {
				Object.assign(existingPage, {
					...registerPageDto,
					status: PageStatus.STARTED,
				});
			}
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

	async approvePage(pageId: Uuid) {
		const page = await this.pageRepository.findOne({
			where: {
				id: pageId,
			},
		});
		if (!page) {
			throw new Error('Page not found');
		}
		page.status = PageStatus.APPROVED;
		await this.pageRepository.save(page);

		this.assetsService.attachAssetToEntity(page);

		this.searchService.indexPage({
			address: page.address,
			content: page.content,
			email: page.email,
			id: page.id,
			name: page.name,
			url: page.url,
			avatar: {
				key: page.avatar?.file_data.key,
			},
		});

		this.send_noti(pageId, PageStatus.APPROVED);

		return page;
	}

	async rejectPage(pageId: Uuid) {
		const page = await this.pageRepository.findOne({
			where: {
				id: pageId,
			},
		});
		if (!page) {
			throw new Error('Page not found');
		}

		page.status = PageStatus.REJECTED;
		await this.pageRepository.save(page);
		this.send_noti(pageId, PageStatus.REJECTED);

		return {
			message: 'Page request rejected',
			reason: 'Information is incorrect or missing',
		};
	}

	private send_noti(pageId: Uuid, status: PageStatus) {}

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
	public async getFollowPages(
		userId: Uuid,
		pagePageOptionsDto: PagePageOptionsDto,
	) {
		const followedPages = await this.followRepository
			.createQueryBuilder('follow')
			.select('follow.page_id', 'pageId')
			.where('follow.user_id = :userId', { userId })
			.getRawMany();

		const pageIds = followedPages.map((item) => item.pageId);

		const pages = await this.pageRepository
			.createQueryBuilder('page')
			.where('page.id IN (:...pageIds)', { pageIds })
			.searchByString(pagePageOptionsDto.q, ['name'])
			.orderBy('page.createdAt', 'DESC');
		const [items, pageMetaDto] = await pages.paginate(pagePageOptionsDto);
		const pagesWithAvatars =
			await this.assetsService.attachAssetToEntities(items);
		return pagesWithAvatars;
	}
	public async followPage(userId: Uuid, pageId: Uuid) {
		const page = await this.pageRepository.findOne({ where: { id: pageId } });
		if (!page || page.status !== PageStatus.APPROVED) {
			throw new NotFoundException('Page not found or not approved.');
		}

		const existingFollow = await this.followRepository.findOne({
			where: { user: { id: userId }, page: { id: pageId } },
		});
		if (existingFollow) {
			throw new BadRequestException('You already follow this page.');
		}

		const follow = this.followRepository.create({
			user: { id: userId },
			page: { id: pageId },
		});

		await this.followRepository.save(follow);

		return follow;
	}
	public async unfollowPage(userId: Uuid, pageId: Uuid): Promise<void> {
		const existingFollow = await this.followRepository.findOne({
			where: { user: { id: userId }, page: { id: pageId } },
		});

		if (!existingFollow) {
			throw new NotFoundException('You are not following this page.');
		}

		await this.followRepository.delete({ id: existingFollow.id });
	}
}
