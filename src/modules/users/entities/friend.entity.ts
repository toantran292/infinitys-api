import { Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'friends' })
export class FriendEntity extends AbstractEntity {
	@ManyToOne(() => UserEntity, (user) => user.friends1)
	source!: UserEntity;

	@ManyToOne(() => UserEntity, (user) => user.friends2)
	target!: UserEntity;
}
