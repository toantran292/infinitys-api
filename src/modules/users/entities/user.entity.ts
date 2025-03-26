import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { RoleType } from '../../../constants/role-type';
import { PageUserEntity } from '../../pages/entities/page-user.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { ReactEntity } from '../../reacts/entities/react.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import {
	GroupChatMemberEntity,
	GroupChatMessageEntity,
} from '../../chats/entities/chat.entity';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { FriendEntity } from './friend.entity';
import { FriendRequestEntity } from './friend-request.entity';
import { GenderType } from '../../../constants/gender-type';
import { AssetField } from '../../../decoractors/asset.decoractor';
import { SubmissionSummary, Submission } from '../../problems/entities';
@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
	@Column()
	firstName!: string;

	@Column()
	lastName!: string;

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

	@AssetField()
	avatar?: AssetEntity;

	@AssetField()
	banner?: AssetEntity;

	friend_status?: string;

	total_connections: number;

	// Relations

	@OneToMany(() => FriendRequestEntity, (request) => request.source)
	sentFriendRequests!: FriendRequestEntity[];

	// Yêu cầu kết bạn được nhận (receiver <- sender)
	@OneToMany(() => FriendRequestEntity, (request) => request.target)
	receivedFriendRequests!: FriendRequestEntity[];

	// Danh sách bạn bè (kết nối từ user1 hoặc user2)
	@OneToMany(() => FriendEntity, (friend) => friend.source)
	friends1!: FriendEntity[];

	@OneToMany(() => FriendEntity, (friend) => friend.target)
	friends2!: FriendEntity[];

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

	@OneToMany(() => Submission, (submission) => submission.user)
	submissions!: Submission[];

	@OneToMany(() => SubmissionSummary, (summary) => summary.user)
	submissionSummaries!: SubmissionSummary[];
}
