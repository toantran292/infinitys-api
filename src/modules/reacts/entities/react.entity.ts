import { Column, Entity, Generated, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity({ name: 'reacts' })
@Index(['targetId', 'targetType'], { unique: true })
export class ReactEntity extends AbstractEntity {
	@Column({ default: true })
	isActive!: boolean;

	@ManyToOne(() => UserEntity, (user) => user.reacts)
	user!: UserEntity;

	@Column()
	@Generated('uuid')
	targetId!: Uuid;

	@Column()
	targetType!: string;
}
