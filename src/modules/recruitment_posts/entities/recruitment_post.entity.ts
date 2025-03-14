import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PageUserEntity } from '../../pages/entities/page-user.entity';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import { ProblemRecruitmentPostEntity } from '../../problems/entities/problem.entity';
import { RecruitmentPostDto } from '../dto/recruitment-post.dto';
import { UseDto } from '../../../decoractors/use-dto.decorators';

@Entity('recruitment_posts')
@UseDto(RecruitmentPostDto)
export class RecruitmentPostEntity extends AbstractEntity<RecruitmentPostDto> {
	@Column()
	active!: boolean;

	@Column()
	title!: string;

	@Column()
	jobPosition: string;

	@Column()
	location: string;

	@Column()
	workType: string;

	@Column()
	jobType: string;

	@Column('text', { comment: 'Markdown formatted text for job description' })
	description!: string;

	@ManyToOne(() => PageUserEntity, (pageUser) => pageUser.recruitmentPosts)
	pageUser!: PageUserEntity;

	@OneToMany(
		() => ApplicationEntity,
		(application) => application.recruitmentPost,
	)
	applications!: ApplicationEntity[];

	@OneToMany(
		() => ProblemRecruitmentPostEntity,
		(problemRecruitmentPost) => problemRecruitmentPost.recruitmentPost,
	)
	problems!: ProblemRecruitmentPostEntity[];
}
