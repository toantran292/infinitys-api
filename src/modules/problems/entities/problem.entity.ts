import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { TestcaseEntity } from './testcase.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PageEntity } from '../../pages/entities/page.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { ApplicationProblemEntity } from '../../applications/entities/application.entity';

@Entity({ name: 'problems' })
export class ProblemEntity extends AbstractEntity {
	@Column()
	content!: string;

	@ManyToOne(() => PageEntity, (page) => page.problems, { nullable: true })
	page?: PageEntity;

	@OneToMany(() => ProblemUserEntity, (problemUser) => problemUser.problem)
	problemUsers!: ProblemUserEntity[];

	@OneToMany(() => TestcaseEntity, (testcase) => testcase.problem)
	testcases!: TestcaseEntity[];

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

	@OneToMany(
		() => ProblemUserTestcaseEntity,
		(problemUserTestcase) => problemUserTestcase.problemUser,
	)
	problemUserTestcases!: ProblemUserTestcaseEntity[];
}

@Entity({ name: 'problems_users_testcases' })
export class ProblemUserTestcaseEntity extends AbstractEntity {
	@ManyToOne(
		() => ProblemUserEntity,
		(problemUser) => problemUser.problemUserTestcases,
	)
	problemUser!: ProblemUserEntity;

	@ManyToOne(() => TestcaseEntity, (testcase) => testcase.problemUserTestcases)
	testcase!: TestcaseEntity;

	@Column()
	isAccepted!: boolean;
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
