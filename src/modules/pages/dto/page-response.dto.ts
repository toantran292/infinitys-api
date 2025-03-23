import { Expose, Type } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { PageStatus } from 'src/constants/page-status';
import { AssetResponseDto } from 'src/modules/users/dto/user-response.dto';

export class PageResponseDto extends AbstractDto {
	@Expose()
	name!: string;

	@Expose()
	address!: string;

	@Expose()
	url!: string;

	@Expose()
	content?: string;

	@Expose()
	email!: string;

	@Expose()
	status!: PageStatus;

	@Expose()
	@Type(() => AssetResponseDto)
	avatar?: AssetResponseDto;

	@Expose()
	admin_user_id?: Uuid;
}
