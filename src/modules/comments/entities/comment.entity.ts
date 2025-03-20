import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { CommentDto, type CommentDtoOptions } from '../dto/comment.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { UseDto } from '../../../decoractors/use-dto.decorators';

@Entity({ name: 'comments' })
export class CommentEntity extends AbstractEntity {
	@Column({ type: 'text' })
	content!: string;

	@ManyToOne(() => UserEntity, (user) => user.comments)
	user!: UserEntity;

	@ManyToOne(() => PostEntity, (post) => post.comments)
	post!: PostEntity;
}
