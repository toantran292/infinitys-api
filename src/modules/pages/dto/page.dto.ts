import { StringField } from '../../../decoractors/field.decoractors';
import { PageEntity } from '../entities/page.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export type PageDtoOptions = Partial<{ isActive: boolean }>;

export class PageDto extends AbstractDto {
	@StringField()
	name!: string;

	constructor(page: PageEntity) {
		super(page);
		this.name = page.name;
	}
}
