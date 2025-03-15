import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { PageDto, type PageDtoOptions } from '../dto/page.dto';
import { UseDto } from '../../../decoractors/use-dto.decorators';
import { PageUserEntity } from './page-user.entity';
import { ProblemEntity } from '../../problems/entities/problem.entity';
import { PageStatus } from '../../../constants/page-status';
import { AssetEntity } from '../../assets/entities/asset.entity';

@Entity({ name: 'pages' })
@UseDto(PageDto)
export class PageEntity extends AbstractEntity<PageDto, PageDtoOptions> {
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

	avatar?: AssetEntity[];

	@OneToMany(() => PageUserEntity, (pageUser) => pageUser.page)
	pageUsers!: PageUserEntity[];

	@OneToMany(() => ProblemEntity, (problem) => problem.page)
	problems!: ProblemEntity[];

	admin_user_id?: Uuid;
}
