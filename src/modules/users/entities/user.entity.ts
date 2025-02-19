import { Column, Entity, OneToMany, VirtualColumn } from 'typeorm';
import { UseDto } from '../../../decoractors/use-dto.decorators';
import { UserDto, type UserDtoOptions } from '../dto/user.dto';
import { AbstractEntity } from '../../../common/abstract.entity';
import { RoleType } from '../../../constants/role-type';
import { PageUserEntity } from '../../pages/entities/page-user.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { ReactEntity } from '../../reacts/entities/react.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import { GroupChatMemberEntity, GroupChatMessageEntity } from '../../chats/entities/chat.entity';
import { ProblemUserEntity } from '../../problems/entities/problem.entity';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { GenderType } from '../../../constants/gender-type';

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

	@Column({ type: 'date', nullable: true })
	dateOfBirth?: Date;

	@Column({ type: 'enum', enum: GenderType, nullable: true })
	gender?: GenderType;

	@Column({ nullable: true })
	major?: string;

	@Column({ nullable: true })
	desiredJobPosition?: string;

	@Column({ default: true })
	active!: boolean;

	@OneToMany(() => AssetEntity, (asset) => asset.owner_id)
	assets?: AssetEntity[];

	@OneToMany(() => PageUserEntity, (pageUser) => pageUser.user)
	pageUsers!: PageUserEntity[];

	@OneToMany(() => PostEntity, (post) => post.author)
	posts!: PostEntity[];

	@OneToMany(() => ReactEntity, (react) => react.user)
	reacts!: ReactEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.user)
	comments!: CommentEntity[];

	@OneToMany(
		() => ApplicationEntity,
		(application) => application.recruitmentPost,
	)
	applications!: ApplicationEntity[];

	@OneToMany(
		() => GroupChatMemberEntity,
		(groupChatMember) => groupChatMember.user,
	)
	groupChatMembers!: GroupChatMemberEntity[];

	@OneToMany(
		() => GroupChatMessageEntity,
		(groupChatMessage) => groupChatMessage.user,
	)
	groupChatMessages!: GroupChatMessageEntity[];

	@OneToMany(() => ProblemUserEntity, (problemUser) => problemUser.user)
	problemUsers!: ProblemUserEntity[];
}