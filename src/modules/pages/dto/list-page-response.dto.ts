import { PageDto } from 'src/common/dto/page.dto';
import { Expose, Type } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { PageStatus } from 'src/constants/page-status';
import { AssetResponseDto } from 'src/modules/users/dto/user-response.dto';

export class ListPageResponseDto extends AbstractDto {
	@Expose()
	name!: string;

	@Expose()
	content?: string;

	@Expose()
	address!: string;

	@Expose()
	url!: string;

	@Expose()
	email!: string;

	@Expose()
	status: PageStatus;

	@Expose()
	@Type(() => AssetResponseDto)
	avatar?: AssetResponseDto;
}

export class PaginationPageResponseDto extends PageDto {
	@Expose()
	@Type(() => ListPageResponseDto)
	readonly items: ListPageResponseDto[];
}
