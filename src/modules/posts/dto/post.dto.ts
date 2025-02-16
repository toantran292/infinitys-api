import { Expose, Type } from 'class-transformer';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PostEntity } from '../entities/post.entity';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { CommentDto } from 'src/modules/comments/dto/comment.dto';

export type PostDtoOptions = {};

export class PostDto extends AbstractDto {
	constructor(post: PostEntity) {
		super(post);
	}
}

export class ProfilePostDto {
	@Expose()
	id: string;

	@Expose()
	content: string;

	@Expose()
	createdAt: Date;

	@Expose()
	@Type(() => CommentDto)
	comments: CommentDto[];
}
