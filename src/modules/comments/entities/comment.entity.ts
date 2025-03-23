import { Column, Entity, ManyToOne, OneToMany, VirtualColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { CommentDto, type CommentDtoOptions } from '../dto/comment.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { ReactEntity } from '../../reacts/entities/react.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends AbstractEntity {
	@Column({ type: 'text' })
	content!: string;

	@ManyToOne(() => UserEntity, (user) => user.comments)
	user!: UserEntity;

	@OneToMany(() => PostEntity, (post) => post.comments)
	post!: PostEntity;

	@VirtualColumn({
		query: (alias) =>
			`SELECT * FORM reacts WHERE reacts.targetId = ${alias}.id AND reacts.targetType = 'comments'`,
	})
	reacts!: ReactEntity[];
}
