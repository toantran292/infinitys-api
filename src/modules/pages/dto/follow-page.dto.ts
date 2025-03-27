// follow-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { PageResponseDto } from './page-response.dto';

export class FollowResponseDto {
	@Expose()
	@Type(() => PageResponseDto)
	page: PageResponseDto;
}
