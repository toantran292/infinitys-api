import { faker } from '@faker-js/faker';

import { generateHash } from '../../common/utils';
import { RoleType } from '../../constants/role-type';

export const createUserFactory = async (overrides = {}) => {
	const defaultValues = {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email(),
		password: await generateHash('password'),
		role: RoleType.USER,
		active: true,
	};

	return {
		...defaultValues,
		...overrides,
	};
};
