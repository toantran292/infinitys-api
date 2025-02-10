import { Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { RecruitmentPostEntity } from '../../recruitment_posts/entities/recruitment_post.entity';

@Entity({ name: 'applications' })
export class ApplicationEntity extends AbstractEntity{
	@ManyToOne(() => UserEntity, (user) => user.applications)
	user!: UserEntity;

	@ManyToOne(() => RecruitmentPostEntity, (recruitmentPost) => recruitmentPost.applications)
	recruitmentPost!: RecruitmentPostEntity;
}
