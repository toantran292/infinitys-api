import { Column, Entity, Index, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { PageStatus } from '../../../constants/page-status';
import { AssetField } from '../../../decoractors/asset.decoractor';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { Problem } from '../../problems/entities/problem.entity';
import { RoleTypePage } from '../../../constants/role-type';

import { PageUserEntity } from './page-user.entity';

@Entity({ name: 'pages' })
export class Page extends AbstractEntity {
	@Column()
	name!: string;

	@Column({ nullable: true })
	content?: string;

	@Column()
	address!: string;

	@Column()
	url!: string;

	@Index()
	@Column({ unique: true })
	email!: string;

	@Column({ type: 'enum', enum: PageStatus, default: PageStatus.STARTED })
	status: PageStatus;

	@AssetField()
	avatar?: AssetEntity;

	@OneToMany(() => PageUserEntity, (pageUser) => pageUser.page)
	pageUsers!: PageUserEntity[];

	@OneToMany(() => Problem, (problem) => problem.page)
	problems!: Problem[];

	admin_user_id?: Uuid;

	pageRole?: RoleTypePage;
}
