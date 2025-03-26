import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { CommentEntity } from './comment.entity';

@Entity('comment_statistics')
export class CommentStatistics {
	@PrimaryColumn('uuid', { name: 'comment_id' })
	commentId: string;

	@Column({ default: 0, name: 'react_count' })
	reactCount: number;

	@OneToOne(() => CommentEntity, (comment) => comment.statistics)
	@JoinColumn({ name: 'comment_id' })
	comment: CommentEntity;
}
