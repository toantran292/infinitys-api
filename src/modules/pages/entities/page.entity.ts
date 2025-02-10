import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { PageDto, PageDtoOptions } from '../dto/page.dto';
import { UseDto } from '../../../decoractors/use-dto.decorators';
import { PageUserEntity } from './page-user.entity';

@Entity({ name: 'pages' })
@UseDto(PageDto)
export class PageEntity extends AbstractEntity<PageDto, PageDtoOptions> {
	@Column()
	name!: string;

	@Column()
	content!: string;

	@OneToMany(() => PageUserEntity, (pageUser) => pageUser.page)
	pageUsers!: PageUserEntity[];
}
