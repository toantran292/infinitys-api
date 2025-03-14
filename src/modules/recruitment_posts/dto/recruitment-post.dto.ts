import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RecruitmentPostEntity } from '../entities/recruitment_post.entity';
import {
    StringField,
    BooleanField,
} from '../../../decoractors/field.decoractors';
import { PageUserDto } from '../../pages/dto/page-user.dto';

export class RecruitmentPostDto extends AbstractDto {
    @BooleanField()
    active!: boolean;

    @StringField()
    title!: string;

    @StringField()
    jobPosition!: string;

    @StringField()
    location!: string;

    @StringField()
    workType!: string;

    @StringField()
    jobType!: string;

    @StringField()
    description!: string;

    pageUser?: PageUserDto;

    constructor(recruitmentPost: RecruitmentPostEntity) {
        super(recruitmentPost);
        this.active = recruitmentPost.active;
        this.title = recruitmentPost.title;
        this.jobPosition = recruitmentPost.jobPosition;
        this.location = recruitmentPost.location;
        this.workType = recruitmentPost.workType;
        this.jobType = recruitmentPost.jobType;
        this.description = recruitmentPost.description;
        this.pageUser = recruitmentPost.pageUser?.toDto();
    }
} 