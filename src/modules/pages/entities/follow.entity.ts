import { Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../users/entities/user.entity';

import { Page } from './page.entity';

@Entity({ name: 'follows' })
export class FollowEntity extends AbstractEntity {
	@ManyToOne(() => Page, (page) => page.pageUsers)
	page!: Page;

	@ManyToOne(() => User, (user) => user.pageUsers)
	user!: User;
}
