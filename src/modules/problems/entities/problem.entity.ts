import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PageEntity } from '../../pages/entities/page.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { ApplicationProblemEntity } from '../../applications/entities/application.entity';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { AssetField } from '../../../decoractors/asset.decoractor';

export enum ProblemDifficulty {
	Easy = 'easy',
	Medium = 'medium',
	Hard = 'hard',
}

@Entity({ name: 'problems' })
export class Problem extends AbstractEntity {
	@Column()
	title!: string;

	@Column()
	content!: string;

	@Column({
		type: 'enum',
		enum: ProblemDifficulty,
		default: ProblemDifficulty.Easy,
	})
	difficulty!: ProblemDifficulty;

	@Column({ default: 1000 })
	timeLimit!: number;

	@Column({ default: 262144 })
	memoryLimit!: number;

	@Column({ type: 'jsonb', nullable: true })
	examples!: object;

	@Column({ type: 'jsonb', nullable: true })
	constraints!: object;

	@AssetField({ multiple: true })
	testcases!: AssetEntity[];

	@ManyToOne(() => PageEntity, (page) => page.problems, { nullable: true })
	page?: PageEntity;

	@OneToMany(() => ProblemUser, (problemUser) => problemUser.problem)
	problemUsers!: ProblemUser[];

	@OneToMany(
		() => ProblemRecruitmentPost,
		(problemRecruitmentPost) => problemRecruitmentPost.problem,
	)
	problemRecruitmentPosts!: ProblemRecruitmentPost[];
}

@Entity({ name: 'problems_users' })
export class ProblemUser extends AbstractEntity {
	@ManyToOne(() => Problem, (problem) => problem.problemUsers)
	problem!: Problem;

	@ManyToOne(() => UserEntity, (user) => user.problemUsers)
	user!: UserEntity;

	@Column({ type: 'jsonb', nullable: true })
	result!: object;
}

@Entity({ name: 'problems_recruitment_posts' })
export class ProblemRecruitmentPost extends AbstractEntity {
	@ManyToOne(() => Problem, (problem) => problem.problemRecruitmentPosts)
	problem!: Problem;

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
