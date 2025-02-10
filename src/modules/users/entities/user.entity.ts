import { Column, Entity, OneToMany, VirtualColumn } from 'typeorm';
import { UseDto } from '../../../decoractors/use-dto.decorators';
import { UserDto, UserDtoOptions } from '../dto/user.dto';
import { AbstractEntity } from '../../../common/abstract.entity';
import { RoleType } from '../../../constants/role-type';
import { PageUserEntity } from '../../pages/entities/page-user.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { ReactEntity } from '../../reacts/entities/react.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import { FriendEntity } from './friend.enity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
	@Column()
	firstName!: string;

	@Column()
	lastName!: string;

	@VirtualColumn({
		query: (alias) =>
			`SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
	})
	fullName!: string;

	@Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
	role!: RoleType;

	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@OneToMany(() => PageUserEntity, (pageUser) => pageUser.user)
	pageUsers!: PageUserEntity[];

	@OneToMany(() => PostEntity, (post) => post.author)
	posts!: PostEntity[];

	@OneToMany(() => ReactEntity, (react) => react.user)
	reacts!: ReactEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.user)
	comments!: CommentEntity[];

	@OneToMany(() => ApplicationEntity, (application) => application.recruitmentPost)
	applications!: ApplicationEntity[];
}
