import { Expose, Transform, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
	AssetResponseDto,
	UserResponseDto,
} from '../../users/dto/user-response.dto';

export type PostDtoOptions = {};

export class PostStatisticsDto extends AbstractDto {
	@Expose()
	commentCount: number;

	@Expose()
	reactCount: number;
}

export class PostDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose()
	@Type(() => UserResponseDto)
	author: UserResponseDto;

	@Expose({ toClassOnly: true })
	@Type(() => PostStatisticsDto)
	statistics: PostStatisticsDto;

	@Expose()
	@Transform(({ obj }) => obj.statistics?.commentCount || 0)
	@Type(() => Number)
	comment_count: number;

	@Expose()
	@Transform(({ obj }) => obj.statistics?.reactCount || 0)
	@Type(() => Number)
	react_count: number;

	@Expose()
	@Type(() => AssetResponseDto)
	images: AssetResponseDto[];
}
