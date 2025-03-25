import { Column, Entity, Generated, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity({ name: 'reacts' })
@Index(['targetId', 'targetType', 'userId'], { unique: true })
export class ReactEntity extends AbstractEntity {
	@Column({ default: true })
	isActive!: boolean;

	@ManyToOne(() => User, (user) => user.reacts)
	user!: User;

	@Column()
	userId!: string;

	@Column()
	@Generated('uuid')
	targetId!: Uuid;

	@Column()
	targetType!: string;
}
