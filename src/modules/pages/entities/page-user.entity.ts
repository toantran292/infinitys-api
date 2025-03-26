import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { RoleTypePage } from '../../../constants/role-type';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { User } from '../../users/entities/user.entity';

import { Page } from './page.entity';

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
