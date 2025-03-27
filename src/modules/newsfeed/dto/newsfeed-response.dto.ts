import { Expose, Type } from 'class-transformer';
import { CursorPageDto } from '../../../common/dto/page.dto';
import { PostDto } from '../../posts/dto/post.dto';

export class NewsfeedResponseDto extends PostDto {}

export class CursorNewsfeedResponseDto extends CursorPageDto {
	@Expose()
	@Type(() => NewsfeedResponseDto)
	readonly items: NewsfeedResponseDto[];
}
