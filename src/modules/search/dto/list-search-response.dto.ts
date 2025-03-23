import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class ListSearchResponseDto extends UserResponseDto {
	@Expose()
	friend_status?: string;
}

export class PaginationListSearchResponseDto extends PageDto {
	@Expose()
	@Type(() => ListSearchResponseDto)
	items!: ListSearchResponseDto[];
}
