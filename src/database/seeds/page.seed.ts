import { DataSource } from 'typeorm';
import { Page } from '../../modules/pages/entities/page.entity';
import { PageStatus } from '../../constants/page-status';
import { User } from '../../modules/users/entities/user.entity';
import { PageUserEntity } from '../../modules/pages/entities/page-user.entity';
import { RoleType } from '../../constants/role-type';
import { RoleTypePage } from '../../constants/role-type';

export const pageSeed = async (dataSource: DataSource) => {
	const pageRepository = dataSource.getRepository(Page);
	const userRepository = dataSource.getRepository(User);
	const pageUserRepository = dataSource.getRepository(PageUserEntity);

	// Lấy một số user để làm admin cho pages
	const users = await userRepository.find({
		take: 5,
		where: { role: RoleType.USER },
	});

	const pages = [
		{
			name: 'Tech Community',
			content: 'A community for tech enthusiasts and developers',
			address: 'Ho Chi Minh City',
			url: 'tech-community',
			email: 'tech@community.com',
			status: PageStatus.APPROVED,
			admin_user_id: users[0].id,
		},
		{
			name: 'Design Hub',
			content: 'Creative space for designers',
			address: 'Ha Noi',
			url: 'design-hub',
			email: 'design@hub.com',
			status: PageStatus.STARTED,
			admin_user_id: users[1].id,
		},
		{
			name: 'Startup Network',
			content: 'Connect and grow with fellow entrepreneurs',
			address: 'Da Nang',
			url: 'startup-network',
			email: 'startup@network.com',
			status: PageStatus.REJECTED,
			admin_user_id: users[2].id,
		},
	];

	// Lưu từng page và tạo liên kết với admin user
	for (const pageData of pages) {
		const { admin_user_id, ...pageInfo } = pageData;

		const existingPage = await pageRepository.findOne({
			where: { email: pageInfo.email },
		});

		if (existingPage) {
			continue;
		}

		// Tạo page
		const page = pageRepository.create(pageInfo);
		const savedPage = await pageRepository.save(page);

		// Tạo liên kết page-user cho admin
		const pageUser = pageUserRepository.create({
			page: { id: savedPage.id },
			user: { id: admin_user_id },
			role: RoleTypePage.ADMIN,
		});

		await pageUserRepository.save(pageUser);
	}

	console.log('Page seed completed');
};
