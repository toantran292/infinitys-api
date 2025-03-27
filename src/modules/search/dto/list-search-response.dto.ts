import { Type, Expose } from 'class-transformer';

import { PageDto } from '../../../common/dto/page.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ListSearchResponseDto extends UserResponseDto {
	@Expose()
	friend_status?: string;
}

export class PaginationListSearchResponseDto extends PageDto {
	@Expose()
	@Type(() => ListSearchResponseDto)
	items!: ListSearchResponseDto[];
}
