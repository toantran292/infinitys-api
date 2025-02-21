import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PageEntity } from './page.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PageUserDto, type PageUserDtoOptions } from '../dto/page-user.dto';
import { RoleTypePage } from '../../../constants/role-type';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { FriendEntity } from '../../users/entities/friend.entity';

@Entity({ name: 'pages_users' })
export class PageUserEntity extends AbstractEntity<
	PageUserDto,
	PageUserDtoOptions
> {
	@ManyToOne(() => PageEntity, (page) => page.pageUsers)
	page!: PageEntity;

	@ManyToOne(() => UserEntity, (user) => user.pageUsers)
	user!: UserEntity;

	@Column()
	active!: boolean;

	@Column({ type: 'enum', enum: RoleTypePage, default: RoleTypePage.MEMBER })
	role!: RoleTypePage;

	@OneToMany(
		() => RecruitmentPostEntity,
		(recruitmentPost) => recruitmentPost.pageUser,
	)
	recruitmentPosts!: RecruitmentPostEntity[];
}
