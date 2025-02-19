import { Injectable } from '@nestjs/common';
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
		const page = this.pageRepository.create({
			...registerPageDto,
			email: user.email,
		});

		await this.pageRepository.save(page);

		const pageUser = this.pageUserRepository.create({
			page: page,
			user: user,
			active: false,
			role: RoleTypePage.ADMIN,
		});

		await this.pageUserRepository.save(pageUser);

		return page.toDto<PageDto>();
	}

	async approvePage(userId: string, pageId: string) {
		const pageUser = await this.pageUserRepository
			.createQueryBuilder('pages_users')
			.innerJoinAndSelect('pages_users.page', 'pages')
			.where('pages_users.page_id = page_id', { pageId })
			.getOne()
		pageUser.active = true;
		await this.pageUserRepository.save(pageUser);
		return pageUser;
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
