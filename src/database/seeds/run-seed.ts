import dataSource from '../ormconfig';

import { userSeed } from './user.seed';

const runSeed = async () => {
	try {
		// Initialize the database connection
		await dataSource.initialize();
		console.log('Database connection initialized');

		// Run seeds
		await userSeed(dataSource);

		// Add more seed functions here

		console.log('Seeds completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Error running seeds:', error);
		process.exit(1);
	}
};

runSeed();
