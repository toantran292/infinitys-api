import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { ReactEntity } from 'src/modules/reacts/entities/react.entity';
import { AssetEntity } from 'src/modules/assets/entities/asset.entity';

@Entity({ name: 'posts' })
export class PostEntity extends AbstractEntity {
	@Column({ type: 'text' })
	content!: string;

	@ManyToOne(() => UserEntity, (user) => user.posts)
	author!: UserEntity;

	@ManyToOne(() => CommentEntity, (comment) => comment.post)
	comments!: CommentEntity[];

	@ManyToOne(() => ReactEntity, (react) => react.post)
	reacts!: ReactEntity[];

	@ManyToOne(() => AssetEntity, (asset) => asset.owner_id)
	photos!: AssetEntity[];
}
