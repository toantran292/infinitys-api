import { PostDto, PostDtoOptions } from '../dto/post.dto';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity({ name: 'posts' })
export class PostEntity extends AbstractEntity<PostDto, PostDtoOptions> {
	@Column({ type: 'text' })
	content!: string;

	@ManyToOne(() => UserEntity, (user) => user.posts)
	author!: UserEntity;

	@ManyToOne(() => CommentEntity, (comment) => comment.post)
	comments!: CommentEntity[];
}
