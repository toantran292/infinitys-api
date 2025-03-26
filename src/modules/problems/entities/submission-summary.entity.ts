import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Problem } from './problem.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'submission_summaries' })
@Index(['problem.id', 'user.id'], { unique: true })
export class SubmissionSummary extends AbstractEntity {
	@ManyToOne(() => Problem, (problem) => problem.submissionSummaries)
	problem!: Problem;

	@ManyToOne(() => UserEntity, (user) => user.submissionSummaries)
	user!: UserEntity;

	@Column({ default: 0 })
	total!: number;

	@Column({ default: 0 })
	accepted!: number;

	@Column({ default: 0 })
	wrongAnswer!: number;

	@Column({ default: 0 })
	timeLimitExceeded!: number;

	@Column({ default: 0 })
	runtimeError!: number;

	@Column({ default: 0 })
	compilationError!: number;

	@Column({ type: 'float', default: 0 })
	bestRuntime!: number;

	@Column({ type: 'float', default: 0 })
	bestMemory!: number;
}
