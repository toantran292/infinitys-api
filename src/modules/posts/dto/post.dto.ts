import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PostEntity } from '../entities/post.entity';

export type PostDtoOptions = {};

export class PostDto extends AbstractDto {
	constructor(post: PostEntity) {
		super(post);
	}
}
