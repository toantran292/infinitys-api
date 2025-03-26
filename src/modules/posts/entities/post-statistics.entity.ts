import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('post_statistics')
export class PostStatistics {
	@PrimaryColumn('uuid', { name: 'post_id' })
	postId: string;

	@Column({ name: 'comment_count', default: 0 })
	commentCount: number;

	@Column({ name: 'react_count', default: 0 })
	reactCount: number;

	@OneToOne(() => PostEntity)
	@JoinColumn({ name: 'post_id' })
	post: PostEntity;
}
