import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { ProblemRecruitmentPostEntity } from '../../problems/entities/problem.entity';
import { TestcaseEntity } from '../../problems/entities/testcase.entity';

@Entity({ name: 'applications' })
export class ApplicationEntity extends AbstractEntity {
	@ManyToOne(() => UserEntity, (user) => user.applications)
	user!: UserEntity;

	@ManyToOne(
		() => RecruitmentPostEntity,
		(recruitmentPost) => recruitmentPost.applications,
	)
	recruitmentPost!: RecruitmentPostEntity;

	@Column({ type: 'timestamptz', nullable: true })
	problemFinishedAt!: Date;

	@OneToMany(
		() => ApplicationProblemEntity,
		(applicationProblem) => applicationProblem.application,
	)
	applicationProblems!: ApplicationProblemEntity[];
}

@Entity({ name: 'applications_problems' })
export class ApplicationProblemEntity extends AbstractEntity {
	@ManyToOne(
		() => ApplicationEntity,
		(application) => application.applicationProblems,
	)
	application!: ApplicationEntity;

	@ManyToOne(
		() => ProblemRecruitmentPostEntity,
		(problem) => problem.applicationProblems,
	)
	problem!: ProblemRecruitmentPostEntity;

	@OneToMany(
		() => ApplicationProblemTestcaseEntity,
		(applicationProblemTestcase) =>
			applicationProblemTestcase.applicationProblem,
	)
	applicationProblemTestcases!: ApplicationProblemTestcaseEntity[];
}

@Entity({ name: 'applications_problems_testcases' })
export class ApplicationProblemTestcaseEntity extends AbstractEntity {
	@ManyToOne(
		() => ApplicationProblemEntity,
		(applicationProblem) => applicationProblem.applicationProblemTestcases,
	)
	applicationProblem!: ApplicationProblemEntity;

	@ManyToOne(
		() => TestcaseEntity,
		(testcase) => testcase.applicationProblemTestcases,
	)
	testcase!: TestcaseEntity;

	@Column()
	isAccepted!: boolean;
}
