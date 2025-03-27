import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('newsfeed_items')
export class NewsfeedItem extends AbstractEntity {
	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column('uuid')
	userId: string;

	@ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'post_id' })
	post: PostEntity;

	@Column('uuid')
	postId: string;

	@Column('float', { default: 0 })
	edgeRank: number;

	@Column('boolean', { default: false })
	isSeen: boolean;

	@Column('timestamp', { nullable: true })
	seenAt: Date;
}
