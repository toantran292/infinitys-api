import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { AssetField } from '../../../decoractors/asset.decoractor';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

import { PostStatistics } from './post-statistics.entity';

@Entity({ name: 'posts' })
export class PostEntity extends AbstractEntity {
	@Column({ type: 'text' })
	content!: string;

	@ManyToOne(() => User, (user) => user.posts)
	author!: User;

	@OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
	comments!: CommentEntity[];

	@OneToOne(() => PostStatistics, (statistics) => statistics.post, {
		cascade: true,
	})
	statistics!: PostStatistics;

	@Column({ type: 'int', default: 0 })
	comment_count!: number;

	@Column({ type: 'int', default: 0 })
	react_count!: number;

	@AssetField({ multiple: true })
	images!: AssetEntity[];
}
