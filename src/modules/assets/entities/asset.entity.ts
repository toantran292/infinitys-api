import { Column, Entity, Generated, Index } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Expose } from 'class-transformer';
@Entity({ name: 'assets' })
@Index(['owner_id', 'type', 'owner_type'])
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

	@Expose()
	url!: string;
}
