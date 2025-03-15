import { Column, Entity, Generated, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PageEntity } from '../../pages/entities/page.entity';

@Entity({ name: 'assets' })
@Index(['owner_type', 'owner_id'])
export class AssetEntity extends AbstractEntity {
	@Column()
	type!: string;

	@Column()
	owner_type!: string;

	@Column()
	@Generated('uuid')
	owner_id!: Uuid;

	@Column({
		type: 'jsonb',
		default: {},
	})
	file_data!: {
		key: string;
		size: number;
		name: string;
		content_type: string;
	};

	url!: string;
}
