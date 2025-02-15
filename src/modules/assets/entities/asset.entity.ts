import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';

@Entity({ name: 'assets' })
export class AssetEntity extends AbstractEntity {
	@Column()
	type!: string;

	@Column()
	owner_type!: string;

	@Column()
	owner_id!: number;

	@Column({
		type: 'jsonb'
	})
	file_data: object;
}
