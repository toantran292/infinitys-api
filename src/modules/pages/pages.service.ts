import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageEntity } from './entities/page.entity';
import { PageUserEntity } from './entities/page-user.entity';
import { RegisterPageDto } from './dto/create-page.dto';
import { UserEntity } from '../users/entities/user.entity';
import { RoleTypePage } from '../../constants/role-type';

@Injectable()
export class PagesService {
	logger: Logger;

	constructor(
		@InjectRepository(PageEntity)
		private readonly pageRepository: Repository<PageEntity>,

		@InjectRepository(PageUserEntity)
		private readonly pageUserRepository: Repository<PageUserEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {
		this.logger = new Logger(PagesService.name);
	}

	async getAllPages(): Promise<any[]> {
		this.logger.log('Fetching all pages...');

		const pages = await this.pageRepository.find({
			relations: ['pageUsers', 'pageUsers.user'],
		});

		return pages.map((page) => {
			const owner = page.pageUsers.find(
				(user) => user.role === RoleTypePage.OPERATOR,
			);

			const ownerData = owner
				? {
						id: owner.user.id,
						firstName: owner.user.firstName,
						email: owner.user.email,
					}
				: null;

			return {
				id: page.id,
				name: page.name,
				content: page.content,
				owner: ownerData,
			};
		});
	}

	async getMyPages(userId: string): Promise<PageEntity[]> {
		this.logger.log(`🔍 Fetching pages owned by user ID: ${userId}`);

		return this.pageUserRepository
			.createQueryBuilder('pages_users')
			.innerJoinAndSelect('pages_users.page', 'pages')
			.where('pages_users.userId = :userId', { userId })
			.andWhere('pages_users.role = :role', { role: RoleTypePage.OPERATOR })
			.getMany()
			.then((pageUsers) => pageUsers.map((pageUser) => pageUser.page));
	}

	async registerPage(
		userId: string,
		registerPageDto: RegisterPageDto,
	): Promise<PageEntity> {
		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException('Không tìm thấy người dùng');
		}

		const page = this.pageRepository.create({
			...registerPageDto,
		});
		await this.pageRepository.save(page);

		const pageUser = this.pageUserRepository.create({
			page: page,
			user: user,
			active: true,
			role: RoleTypePage.OPERATOR,
		});
		await this.pageUserRepository.save(pageUser);

		return page;
	}
}
