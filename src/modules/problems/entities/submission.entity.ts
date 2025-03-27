import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { TestCaseResult, SubmissionResult } from '../problems.type';

import { Problem } from './problem.entity';

@Entity({ name: 'submissions' })
export class Submission extends AbstractEntity {
	@ManyToOne(() => Problem, (problem) => problem.submissions)
	problem!: Problem;

	@ManyToOne(() => User, (user) => user.submissions)
	user!: User;

	@Column()
	code: string;

	@Column('jsonb', { nullable: true })
	result: TestCaseResult[];

	@Column('jsonb', { nullable: true })
	summary: SubmissionResult;
}
