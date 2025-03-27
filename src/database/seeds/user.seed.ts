import { DataSource } from 'typeorm';

import { RoleType } from '../../constants/role-type';
import { User } from '../../modules/users/entities/user.entity';

export const userSeed = async (dataSource: DataSource) => {
	const userRepository = dataSource.getRepository(User);

	// Define your seed data
	const users = [
		{
			firstName: 'Admin',
			lastName: 'User',
			email: 'admin@gmail.com',
			password: 'admin123',
			role: RoleType.ADMIN,
			active: true,
		},
		{
			firstName: 'Toan',
			lastName: 'Tran',
			email: 'toantran@gmail.com',
			password: 'toantran123',
			role: RoleType.USER,
			active: true,
		},
		{
			firstName: 'Dat',
			lastName: 'Nguyen',
			email: 'datnguyen@gmail.com',
			password: 'datnguyen123',
			role: RoleType.USER,
			active: true,
		},
		{
			firstName: 'Tri',
			lastName: 'Tran',
			email: 'tritran@gmail.com',
			password: 'tritran123',
			role: RoleType.USER,
			active: true,
		},
		{
			firstName: 'Ngoc',
			lastName: 'Khuu',
			email: 'ngockhuu@gmail.com',
			password: 'ngockhuu123',
			role: RoleType.USER,
			active: true,
		},
	];
	// Insert users
	for (const userData of users) {
		// Check if user already exists
		const existingUser = await userRepository.findOne({
			where: { email: userData.email },
		});

		if (!existingUser) {
			const user = userRepository.create(userData);
			await userRepository.save(user);
			console.log(`Created user: ${userData.email}`);
		} else {
			console.log(`User already exists: ${userData.email}`);
		}
	}
};
