import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Page } from './page.entity';
import { User } from '../../users/entities/user.entity';
import { PageUserDto, type PageUserDtoOptions } from '../dto/page-user.dto';
import { RoleTypePage } from '../../../constants/role-type';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { FriendEntity } from '../../users/entities/friend.entity';
import { UseDto } from '../../../decoractors/use-dto.decorators';

@Entity({ name: 'pages_users' })
export class PageUserEntity extends AbstractEntity {
	@ManyToOne(() => Page, (page) => page.pageUsers)
	page!: Page;

	@ManyToOne(() => User, (user) => user.pageUsers)
	user!: User;

	@Column({ default: true })
	active!: boolean;

	@Column({ type: 'enum', enum: RoleTypePage, default: RoleTypePage.MEMBER })
	role!: RoleTypePage;

	@Column({ type: 'date', nullable: true })
	startDate?: Date;

	@Column({ type: 'date', nullable: true })
	endDate?: Date;

	@OneToMany(
		() => RecruitmentPostEntity,
		(recruitmentPost) => recruitmentPost.pageUser,
	)
	recruitmentPosts!: RecruitmentPostEntity[];
}
