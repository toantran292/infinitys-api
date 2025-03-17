import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { PostStatistics } from './post-statistics.entity';

@Entity({ name: 'posts' })
export class PostEntity extends AbstractEntity {
	@Column({ type: 'text' })
	content!: string;

	@ManyToOne(() => UserEntity, (user) => user.posts)
	author!: UserEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
	comments!: CommentEntity[];

	@OneToOne(() => PostStatistics, (statistics) => statistics.post, { cascade: true })
	statistics!: PostStatistics;

	comment_count!: number;
	react_count!: number;
}

