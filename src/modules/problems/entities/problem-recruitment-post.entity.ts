import { Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { ApplicationProblemEntity } from '../../applications/entities/application.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';

import { Problem } from './problem.entity';

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
