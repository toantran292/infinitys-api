import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

import { CommentStatistics } from './comment-statistics.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends AbstractEntity {
	@Column({ type: 'text' })
	content!: string;

	@ManyToOne(() => User, (user) => user.comments)
	user!: User;

	@ManyToOne(() => PostEntity, (post) => post.comments)
	post!: PostEntity;

	@OneToOne(() => CommentStatistics, (statistics) => statistics.comment, {
		cascade: true,
	})
	@JoinColumn()
	statistics!: CommentStatistics;
}
