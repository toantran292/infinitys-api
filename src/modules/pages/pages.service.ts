import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageEntity } from './entities/page.entity';
import { PageUserEntity } from './entities/page-user.entity';
import { RegisterPageDto } from './dto/create-page.dto';
import { UserEntity } from '../users/entities/user.entity';
import { RoleTypePage } from '../../constants/role-type';
import type { PagePageOptionsDto } from './dto/page-page-options.dto';
import type { PageDto as CommonPageDto } from '../../common/dto/page.dto';
import type { PageDto } from './dto/page.dto';
import { Transactional } from 'typeorm-transactional';
import { PageStatus } from '../../constants/page-status';
import { AvatarDto } from '../users/dto/avatar.dto';
import { AssetEntity } from '../assets/entities/asset.entity';
import { AssetsService, FileType } from '../assets/assets.service';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
@Injectable()
export class PagesService {
	constructor(
		@InjectRepository(PageEntity)
		private readonly pageRepository: Repository<PageEntity>,
		@InjectRepository(PageUserEntity)
		private readonly pageUserRepository: Repository<PageUserEntity>,

		@InjectRepository(AssetEntity)
		private readonly assetRepository: Repository<AssetEntity>,
		private readonly assetsService: AssetsService,
	) {}

	async getPages(pagePageOptionsDto: PagePageOptionsDto): Promise<{
		items: PageEntity[];
		meta: PageMetaDto;
	}> {
		const queryBuilder = await this.pageRepository
			.createQueryBuilder('page')
			.where('page.status = :status', { status: PageStatus.APPROVED });

		const [items, pageMeta] = await queryBuilder.paginate(pagePageOptionsDto);

		await this.assetsService.attachAssetToEntities(items);

		return {
			items,
			meta: pageMeta,
		};
	}

	async getPageById(user: UserEntity, pageId: Uuid): Promise<PageEntity> {
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
		user: UserEntity,
		pagePageOptionsDto: PagePageOptionsDto,
	): Promise<{
		items: PageEntity[];
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

	@Transactional()
	async registerPage(
		user: UserEntity,
		registerPageDto: RegisterPageDto,
	): Promise<PageEntity> {
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

		return await this.assetsService.addAssetToEntity(page, {
			type: FileType.AVATAR,
			file_data: avatar,
		});
	}
}
