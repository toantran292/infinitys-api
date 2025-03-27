import { Column, Entity, ManyToOne, Generated } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

import { User } from './user.entity';

export enum FriendshipStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
}

export enum FriendStatus {
	FRIEND = 'friend',
	WAITING = 'waiting',
	RECEIVED = 'received',
}

@Entity({ name: 'friends' })
export class FriendEntity extends AbstractEntity {
	@ManyToOne(() => User, (user) => user.sentFriendships)
	source!: User;

	@Column()
	@Generated('uuid')
	sourceId!: Uuid;

	@ManyToOne(() => User, (user) => user.receivedFriendships)
	target!: User;

	@Column()
	@Generated('uuid')
	targetId!: Uuid;

	@Column({
		type: 'enum',
		enum: FriendshipStatus,
		default: FriendshipStatus.PENDING,
	})
	status!: FriendshipStatus;
}
