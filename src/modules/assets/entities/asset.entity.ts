import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';


@Entity({ name: 'assets' })
export class AssetEntity extends AbstractEntity {
	@Column()
	type!: string;

	@Column()
	owner_type!: string;

	@Column()
	@Generated("uuid")
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

	@ManyToOne(() => UserEntity, (user) => user.assets)
	owner!: UserEntity;
}
