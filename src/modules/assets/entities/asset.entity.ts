import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';

@Entity({ name: 'assets' })
export class AssetEntity
	extends AbstractEntity {
	@Column()
	name!: string;

	@Column()
	url!: string;

	@Column()
	targetId!: string;

	@Column()
	targetType!: string;
}
