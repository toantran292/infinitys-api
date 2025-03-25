import {
	Column,
	Entity,
	Generated,
	Index,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';
import { ProblemRecruitmentPost } from '../../problems/entities';

@Entity({ name: 'applications' })
@Index(['userId', 'recruitmentPostId'], { unique: true })
export class ApplicationEntity extends AbstractEntity {
	@ManyToOne(() => User, (user) => user.applications, { nullable: false })
	user!: User;

	@Column()
	@Generated('uuid')
	userId: Uuid;

	@ManyToOne(
		() => RecruitmentPostEntity,
		(recruitmentPost) => recruitmentPost.applications,
	)
	recruitmentPost!: RecruitmentPostEntity;

	@Column()
	@Generated('uuid')
	recruitmentPostId: Uuid;

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
		() => ProblemRecruitmentPost,
		(problem) => problem.applicationProblems,
	)
	problem!: ProblemRecruitmentPost;

	@Column({ type: 'jsonb', nullable: true })
	result!: object;
}
