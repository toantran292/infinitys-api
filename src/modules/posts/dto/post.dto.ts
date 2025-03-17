import { UserDto } from 'src/modules/users/dto/user.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PostEntity } from '../entities/post.entity';

export type PostDtoOptions = {};

export class PostDto extends AbstractDto {
	content: string;

	author: UserDto;

	comment_count: number;

	react_count: number;

	constructor(post: PostEntity) {
		super(post);
		this.content = post.content;
		this.author = new UserDto(post.author);

		this.comment_count = post.statistics?.commentCount || 0;
		this.react_count = post.statistics?.reactCount || 0;
	}
}

