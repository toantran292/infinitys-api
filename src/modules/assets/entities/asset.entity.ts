import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PageEntity } from '../../pages/entities/page.entity';

@Entity({ name: 'assets' })
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

	@ManyToOne(() => UserEntity, (user) => user.assets)
	@JoinColumn({ name: 'user_id' })
	owner!: UserEntity;

	@ManyToOne(() => PageEntity, (page) => page.assets, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'page_id' })
	page?: PageEntity;

	url!: string;
}
