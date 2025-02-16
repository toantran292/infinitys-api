import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { PageDto, PageDtoOptions } from '../dto/page.dto';
import { UseDto } from '../../../decoractors/use-dto.decorators';
import { PageUserEntity } from './page-user.entity';
import { ProblemEntity } from '../../problems/entities/problem.entity';

@Entity({ name: 'pages' })
@UseDto(PageDto)
export class PageEntity extends AbstractEntity<PageDto, PageDtoOptions> {
	@Column()
	name!: string;

	@Column({ default: '' })
	content!: string;

	@Column({ default: 'Unknown' })
	address!: string;

	@Column({ default: 'http://example.com' })
	url!: string;


	@OneToMany(() => PageUserEntity, (pageUser) => pageUser.page)
	pageUsers!: PageUserEntity[];

	@OneToMany(() => ProblemEntity, (problem) => problem.page)
	problems!: ProblemEntity[];
}
