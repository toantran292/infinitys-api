import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Problem } from './problem.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { TestCaseResult, SubmissionResult } from '../problems.type';

@Entity({ name: 'submissions' })
export class Submission extends AbstractEntity {
	@ManyToOne(() => Problem, (problem) => problem.submissions)
	problem!: Problem;

	@ManyToOne(() => UserEntity, (user) => user.submissions)
	user!: UserEntity;

	@Column()
	code: string;

	@Column('jsonb', { nullable: true })
	result: TestCaseResult[];

	@Column('jsonb', { nullable: true })
	summary: SubmissionResult;
}
