import { AbstractEntity } from '../../../common/abstract.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Page } from './page.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'follows' })
export class FollowEntity extends AbstractEntity {
	@ManyToOne(() => Page, (page) => page.pageUsers)
	page!: Page;

	@ManyToOne(() => User, (user) => user.pageUsers)
	user!: User;
}
