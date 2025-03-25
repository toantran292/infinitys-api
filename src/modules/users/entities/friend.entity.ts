import { Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from './user.entity';

@Entity({ name: 'friends' })
export class FriendEntity extends AbstractEntity {
	@ManyToOne(() => User, (user) => user.friends1)
	source!: User;

	@ManyToOne(() => User, (user) => user.friends2)
	target!: User;
}
