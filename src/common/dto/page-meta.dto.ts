import { Expose } from 'class-transformer';

export class PageMetaDto {
	@Expose()
	readonly page: number;

	@Expose()
	readonly take: number;

	@Expose()
	readonly itemCount: number;

	@Expose()
	readonly pageCount: number;

	@Expose()
	readonly hasPreviousPage: boolean;

	@Expose()
	readonly hasNextPage: boolean;
}
