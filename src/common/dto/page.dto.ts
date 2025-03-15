import { ApiProperty } from '@nestjs/swagger';
import { ClassField } from '../../decoractors/field.decoractors';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
	@ApiProperty({ isArray: true })
	readonly items: T[];

	@ClassField(() => PageMetaDto)
	readonly meta: PageMetaDto;

	constructor(items: T[], meta: PageMetaDto) {
		this.items = items;
		this.meta = meta;
	}
}
