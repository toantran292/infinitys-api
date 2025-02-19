import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PostEntity } from '../entities/post.entity';

export type PostDtoOptions = {};

export class PostDto extends AbstractDto {
	constructor(post: PostEntity) {
		super(post);
	}
}

//
// export class ProfilePostDto {
// 	@Expose()
// 	id: string;
//
// 	@Expose()
// 	content: string;
//
// 	@Expose()
// 	createdAt: Date;
//
// 	@Expose()
// 	@Type(() => CommentDto)
// 	comments: CommentDto[];
// }
