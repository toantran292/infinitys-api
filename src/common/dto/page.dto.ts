import { Expose, Type } from 'class-transformer';

import { PageMetaDto } from './page-meta.dto';
export class PageDto {
	@Expose()
	@Type(() => PageMetaDto)
	readonly meta: PageMetaDto;
}

export class CursorPageDto {
	@Expose()
	readonly hasMore: boolean;

	@Expose()
	readonly nextCursor: string;
}
