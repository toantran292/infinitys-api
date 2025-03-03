import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'friends_requests' })
export class FriendRequestEntity extends AbstractEntity {
	@ManyToOne(() => UserEntity, (user) => user.sentFriendRequests)
	source!: UserEntity;

	@ManyToOne(() => UserEntity, (user) => user.receivedFriendRequests)
	target!: UserEntity;

	@Column({ default: true })
	is_available!: boolean;
}
