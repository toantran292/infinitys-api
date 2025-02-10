import { AbstractEntity } from '../../../common/abstract.entity';
import { Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'friends' })
export class FriendEntity extends AbstractEntity {
	@ManyToOne(() => UserEntity)
	source!: UserEntity;

	@ManyToOne(() => UserEntity)
	target!: UserEntity;
}
