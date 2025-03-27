import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PageStatus } from '../../../constants/page-status';
import { AssetResponseDto } from '../../users/dto/user-response.dto';

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

	@Expose()
	isFollowing?: boolean;
}
