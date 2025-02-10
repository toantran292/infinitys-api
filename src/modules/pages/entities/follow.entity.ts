import { AbstractEntity } from '../../../common/abstract.entity';
import { Entity, ManyToOne } from 'typeorm';
import { PageEntity } from './page.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'follows' })
export class FollowEntity extends AbstractEntity {
	@ManyToOne(() => PageEntity, (page) => page.pageUsers)
	page!: PageEntity;

	@ManyToOne(() => UserEntity, (user) => user.pageUsers)
	user!: UserEntity;
}
