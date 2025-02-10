import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';

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
}
