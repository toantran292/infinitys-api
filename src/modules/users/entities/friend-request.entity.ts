import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

import { User } from './user.entity';

@Entity({ name: 'friends_requests' })
export class FriendRequestEntity extends AbstractEntity {
	@ManyToOne(() => User, (user) => user.sentFriendRequests)
	source!: User;

	@ManyToOne(() => User, (user) => user.receivedFriendRequests)
	target!: User;

	@Column({ default: true })
	is_available!: boolean;
}
