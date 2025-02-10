import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ProblemEntity, ProblemUserTestcaseEntity } from './problem.entity';
import { ApplicationProblemTestcaseEntity } from '../../applications/entities/application.entity';

@Entity({ name: 'testcases' })
export class TestcaseEntity extends AbstractEntity {
	// @Column() -- to assets
	input: string;

	// @Column() -- to assets
	output: string;

	@Column()
	score: number;

	@ManyToOne(() => ProblemEntity, (problem) => problem.testcases)
	problem: ProblemEntity;

	@OneToMany(
		() => ProblemUserTestcaseEntity,
		(testcaseUser) => testcaseUser.testcase,
	)
	problemUserTestcases: ProblemUserTestcaseEntity[];

	@OneToMany(
		() => ApplicationProblemTestcaseEntity,
		(applicationProblemTestcase) => applicationProblemTestcase.testcase,
	)
	applicationProblemTestcases: ApplicationProblemTestcaseEntity[];
}
