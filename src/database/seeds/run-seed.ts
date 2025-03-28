import { config } from 'dotenv';
config({ path: '.env.dev' }); // Load environment variables

import dataSource from '../ormconfig';

import { userSeed } from './user.seed';
import { elasticsearchSeed } from './elasticsearch.seed';
import { pageSeed } from './page.seed';
import { problemSeed } from './problem.seed';

const runSeed = async () => {
	try {
		// Initialize the database connection
		await dataSource.initialize();
		console.log('Database connection initialized');

		// Run seeds
		await userSeed(dataSource);
		await pageSeed(dataSource);
		await problemSeed(dataSource);

		// Add more seed functions here

		// Run elasticsearch indexing
		await elasticsearchSeed(dataSource);

		console.log('Seeds completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Error running seeds:', error);
		process.exit(1);
	} finally {
		// Close database connection
		await dataSource.destroy();
	}
};

runSeed();
