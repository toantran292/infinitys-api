import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageEntity } from './entities/page.entity';
import { PageUserEntity } from './entities/page-user.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UserEntity } from '../users/entities/user.entity';
import { RoleTypePage } from '../../constants/role-type';

@Injectable()
export class PagesService {
	constructor(
		@InjectRepository(PageEntity)
		private readonly pageRepository: Repository<PageEntity>,

		@InjectRepository(PageUserEntity)
		private readonly pageUserRepository: Repository<PageUserEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async createPage(userId: string, createPageDto: CreatePageDto): Promise<PageEntity> {
		console.log(`Creating Page for User ID: ${userId}`);

		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			console.error('Không tìm thấy người dùng!');
			throw new NotFoundException('Không tìm thấy người dùng');
		}

		// 1️⃣ Tạo Page mới
		const page = this.pageRepository.create({
			...createPageDto,
		});
		await this.pageRepository.save(page);
		console.log(`✅ Page created: ${page.id}`);


		// 2️⃣ Thêm người tạo vào bảng `PageUserEntity`
		const pageUser = this.pageUserRepository.create({
			page: page,
			user: user,
			active: true,
			role: RoleTypePage.OPERATOR,
		});
		await this.pageUserRepository.save(pageUser);
		console.log(`✅ User ${user.id} added as OWNER of Page ${page.id}`);

		return page;
	}
}
