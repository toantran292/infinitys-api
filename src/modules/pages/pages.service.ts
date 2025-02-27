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

@Injectable()
export class PagesService {
	constructor(
		@InjectRepository(PageEntity)
		private readonly pageRepository: Repository<PageEntity>,
		@InjectRepository(PageUserEntity)
		private readonly pageUserRepository: Repository<PageUserEntity>,
	) {}

	async getPages(
		pagePageOptionsDto: PagePageOptionsDto,
	): Promise<CommonPageDto<PageDto>> {
		const queryBuilder = this.pageRepository.createQueryBuilder('page');
		const [items, pageMetaDto] =
			await queryBuilder.paginate(pagePageOptionsDto);

		return items.toPageDto(pageMetaDto);
	}

	async getMyPages(user: UserEntity): Promise<PageDto[]> {
		const queryBuilder = this.pageRepository.createQueryBuilder('page');

		queryBuilder.innerJoinAndSelect('page.pageUsers', 'pageUsers');
		queryBuilder.where('pageUsers.userId = :userId', { userId: user.id });
		queryBuilder.andWhere('pageUsers.role = :role', {
			role: RoleTypePage.ADMIN,
		});

		const pageEntities = await queryBuilder.getMany();

		return pageEntities.toDtos();
	}

	@Transactional()
	async registerPage(
		user: UserEntity,
		registerPageDto: RegisterPageDto,
	): Promise<PageDto> {
		const existingPage = await this.pageRepository
			.createQueryBuilder('page')
			.where('page.email = :email', { email: registerPageDto.email })
			.getOne();

		if (existingPage) {
			if (existingPage.status !== PageStatus.REJECTED) {
				throw new BadRequestException('Page is already registered');
			}

			existingPage.status = PageStatus.STARTED;
		}

		const page =
			existingPage ||
			(await this.pageRepository.create({
				...registerPageDto,
			}));

		await this.pageRepository.save(page);

		const pageUserData = {
			page,
			user,
			role: RoleTypePage.ADMIN,
		};

		const existingPageUser = await this.pageUserRepository
			.createQueryBuilder('page_user')
			.where('page_user.page_id = :pageId', { pageId: page.id })
			.andWhere('page_user.user_id = :userId', { userId: user.id })
			.andWhere('page_user.role = :role', { role: RoleTypePage.ADMIN })
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

	private send_noti(pageId: Uuid, status: PageStatus) {
		console.log(`${status} page ${pageId}`);
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
