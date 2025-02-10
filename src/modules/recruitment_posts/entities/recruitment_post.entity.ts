import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PageUserEntity } from '../../pages/entities/page-user.entity';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import { ProblemRecruitmentPostEntity } from '../../problems/entities/problem.entity';

@Entity('recruitment_posts')
export class RecruitmentPostEntity extends AbstractEntity{
	@Column()
	endDate!: Date;

	@Column()
	active!: boolean;

	@Column()
	title!: string;

	@Column()
	description!: string;

	@Column({
		type: 'jsonb'
	})
	meta: object;

	@ManyToOne(() => PageUserEntity, (pageUser) => pageUser.recruitmentPosts)
	pageUser!: PageUserEntity;

	@OneToMany(() => ApplicationEntity, (application) => application.recruitmentPost)
	applications!: ApplicationEntity[];

	@Column({ type: 'timestamptz' })
	problemStartDate!: Date;

	@Column({ type: 'timestamptz' })
	problemEndDate!: Date;

	@OneToMany(() => ProblemRecruitmentPostEntity, (problemRecruitmentPost) => problemRecruitmentPost.recruitmentPost)
	problems!: ProblemRecruitmentPostEntity[];
}
