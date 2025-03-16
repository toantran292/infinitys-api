import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from 'src/modules/posts/entities/post.entity';

@Entity({ name: 'reacts' })
@Index(['targetId', 'targetType'], { unique: true })
export class ReactEntity extends AbstractEntity {
	@Column()
	isActive!: boolean;

	@ManyToOne(() => UserEntity, (user) => user.reacts)
	user!: UserEntity;

	@Column()
	targetId!: string;

	@Column()
	targetType!: string;

	@ManyToOne(() => PostEntity, (post) => post.reacts)
	post!: PostEntity;
}
