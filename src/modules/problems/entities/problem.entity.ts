import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { Page } from '../../pages/entities/page.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { ApplicationProblemEntity } from '../../applications/entities/application.entity';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { AssetField } from '../../../decoractors/asset.decoractor';
import { Submission } from './submission.entity';
import { SubmissionSummary } from './submission-summary.entity';
import { ProblemRecruitmentPost } from './problem-recruitment-post.entity';

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

	@ManyToOne(() => Page, (page) => page.problems, { nullable: true })
	page?: Page;

	@OneToMany(() => ProblemRecruitmentPost, (prp) => prp.problem)
	problemRecruitmentPosts!: ProblemRecruitmentPost[];

	@OneToMany(() => Submission, (submission) => submission.problem)
	submissions!: Submission[];

	@OneToMany(() => SubmissionSummary, (summary) => summary.problem)
	submissionSummaries!: SubmissionSummary[];

	@Column({ default: 0 })
	totalSubmissions!: number;

	@Column({ default: 0 })
	totalAccepted!: number;
}
