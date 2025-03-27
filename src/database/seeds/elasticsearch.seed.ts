import { DataSource } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { User } from '../../modules/users/entities/user.entity';
import { Page } from '../../modules/pages/entities/page.entity';
import { UserSearchDocument } from '../../modules/search/interfaces/user.interface';
import { PageSearchDocument } from '../../modules/search/interfaces/page.interface';
import { RoleType } from '../../constants/role-type';

export const elasticsearchSeed = async (dataSource: DataSource) => {
	console.log('Seeding elasticsearch...');

	const elasticsearchService = new ElasticsearchService({
		node: process.env.ELASTICSEARCH_NODE,
		auth: {
			username: process.env.ELASTICSEARCH_USERNAME,
			password: process.env.ELASTICSEARCH_PASSWORD,
		},
	});

	// Index users
	const users = await dataSource.getRepository(User).find({
		where: {
			role: RoleType.USER,
		},
	});
	console.log(`Indexing ${users.length} users...`);

	for (const user of users) {
		const userDocument: UserSearchDocument = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		};

		await elasticsearchService.index({
			index: 'users',
			id: user.id,
			body: userDocument,
		});
	}

	// Index pages
	const pages = await dataSource.getRepository(Page).find();
	console.log(`Indexing ${pages.length} pages...`);

	for (const page of pages) {
		const pageDocument: PageSearchDocument = {
			id: page.id,
			name: page.name,
			content: page.content,
			address: page.address,
			url: page.url,
			email: page.email,
		};

		await elasticsearchService.index({
			index: 'pages',
			id: page.id,
			body: pageDocument,
		});
	}

	console.log('Elasticsearch indexing completed');
};
