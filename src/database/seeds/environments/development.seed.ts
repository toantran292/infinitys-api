import { DataSource } from 'typeorm';

import { userSeed } from '../user.seed';

export const developmentSeed = async (dataSource: DataSource) => {
	await userSeed(dataSource);
	// Add more development-specific seeds
};
