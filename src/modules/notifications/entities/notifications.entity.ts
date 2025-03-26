import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class NotificationEntity extends AbstractEntity {
	@ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
	user?: User;

	@Column({ type: 'jsonb', default: {} })
	meta?: Record<string, any>;

	@Column({ type: 'boolean', default: false })
	isReaded?: boolean;
}
