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

	async getPages(
		pagePageOptionsDto: PagePageOptionsDto,
	): Promise<CommonPageDto<PageDto>> {
		const queryBuilder = await this.pageRepository
			.createQueryBuilder('page')
			.where('page.status = :status', { status: PageStatus.APPROVED });

		const [items, pageMetaDto] =
			await queryBuilder.paginate(pagePageOptionsDto);

		await Promise.all(items.map((page) => this.processPageAssets(page)));

		return items.toPageDto(pageMetaDto);
	}

	private async getAssetPage(pageId: Uuid) {
		const queryBuilder = await this.assetRepository
			.createQueryBuilder('asset')
			.leftJoinAndSelect('asset.page', 'page') // ✅ Thêm thông tin của page
			.where('asset.owner_id = :pageId', { pageId })
			.andWhere('asset.owner_type = :ownerType', { ownerType: 'pages' })
			.andWhere('asset.type IN (:...types)', { types: ['avatar', 'banner'] })
			.getOne();
		return queryBuilder;
	}

	private async processPageAssets(pageEntity: PageEntity): Promise<void> {
		if (!pageEntity.assets || pageEntity.assets.length === 0) {
			pageEntity.avatar = null;
			return;
		}

		const avatarAsset =
			pageEntity.assets.find((asset) => asset.type === 'avatar') || null;

		pageEntity.avatar = avatarAsset;

		delete pageEntity.assets;

		if (pageEntity.avatar) {
			await this.assetsService.populateAsset(pageEntity, 'avatar');
		}
	}

	async getPageById(pageId: Uuid): Promise<PageDto> {
		const page = await this.pageRepository.findOne({
			where: { id: pageId },
			relations: ['assets'],
		});

		if (!page) {
			throw new BadRequestException('Trang không tồn tại');
		}

		const assets = await this.getAssetPage(pageId);

		page.assets = assets ? [assets] : [];

		await this.processPageAssets(page);

		return page.toDto<PageDto>();
	}

	async getMyPages(user: UserEntity): Promise<PageDto[]> {
		const queryBuilder = await this.pageRepository
			.createQueryBuilder('page')
			.innerJoin('page.pageUsers', 'pageUsers')
			.where('pageUsers.user_id = :userId', { userId: user.id })
			.andWhere('pageUsers.role = :role', { role: RoleTypePage.ADMIN })
			.getMany();
		if (!queryBuilder) {
			throw new BadRequestException('Page not found');
		}

		return queryBuilder;
	}

	@Transactional()
	async registerPage(
		user: UserEntity,
		registerPageDto: RegisterPageDto,
	): Promise<PageDto> {
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
		console.log('📌 Page đã được lưu:', savePage);
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

		return page.toDto<PageDto>();
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

	private send_noti(pageId: Uuid, status: PageStatus) {
		console.log(`${status} page ${pageId}`);
	}

	public async updateAvatarPage(page_id: Uuid, avatar: AvatarDto) {
		return await this.assetsService.create_or_update(
			FileType.AVATAR,
			'pages',
			page_id,
			avatar,
		);
	}

	// async getAllPages(): Promise<any[]> {
	// 	this.logger.log('Fetching all pages...');
	//
	// 	const pages = await this.pageRepository.find({
	// 		relations: ['pageUsers', 'pageUsers.user'],
	// 	});
	//
	// 	return pages.map((page) => {
	// 		const owner = page.pageUsers.find(
	// 			(user) => user.role === RoleTypePage.OPERATOR,
	// 		);
	//
	// 		const ownerData = owner
	// 			? {
	// 					id: owner.user.id,
	// 					firstName: owner.user.firstName,
	// 					email: owner.user.email,
	// 				}
	// 			: null;
	//
	// 		return {
	// 			id: page.id,
	// 			name: page.name,
	// 			content: page.content,
	// 			owner: ownerData,
	// 		};
	// 	});
	// }
}
