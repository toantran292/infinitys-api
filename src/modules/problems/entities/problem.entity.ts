import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PageEntity } from '../../pages/entities/page.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { ApplicationProblemEntity } from '../../applications/entities/application.entity';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { AssetField } from '../../../decoractors/asset.decoractor';

@Entity({ name: 'problems' })
export class ProblemEntity extends AbstractEntity {
	@Column()
	title!: string;

	@Column()
	content!: string;

	@AssetField({ multiple: true })
	images!: AssetEntity[];

	@AssetField({ multiple: true })
	testcases!: AssetEntity[];

	@ManyToOne(() => PageEntity, (page) => page.problems, { nullable: true })
	page?: PageEntity;

	@OneToMany(() => ProblemUserEntity, (problemUser) => problemUser.problem)
	problemUsers!: ProblemUserEntity[];

	@OneToMany(
		() => ProblemRecruitmentPostEntity,
		(problemRecruitmentPost) => problemRecruitmentPost.problem,
	)
	problemRecruitmentPosts!: ProblemRecruitmentPostEntity[];
}

@Entity({ name: 'problems_users' })
export class ProblemUserEntity extends AbstractEntity {
	@ManyToOne(() => ProblemEntity, (problem) => problem.problemUsers)
	problem!: ProblemEntity;

	@ManyToOne(() => UserEntity, (user) => user.problemUsers)
	user!: UserEntity;

	@Column({ type: 'jsonb', nullable: true })
	result!: object;
}

@Entity({ name: 'problems_recruitment_posts' })
export class ProblemRecruitmentPostEntity extends AbstractEntity {
	@ManyToOne(() => ProblemEntity, (problem) => problem.problemRecruitmentPosts)
	problem!: ProblemEntity;

	@ManyToOne(
		() => RecruitmentPostEntity,
		(recruitmentPost) => recruitmentPost.problems,
	)
	recruitmentPost!: RecruitmentPostEntity;

	@OneToMany(
		() => ApplicationProblemEntity,
		(applicationProblem) => applicationProblem.problem,
	)
	applicationProblems!: ApplicationProblemEntity[];
}
