import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecruitmentPostEntity } from '../recruitment_posts/entities/recruitment_post.entity';
import { User } from '../users/entities/user.entity';

import { ApplicationEntity } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
	constructor(
		@InjectRepository(ApplicationEntity)
		private readonly applicationRepo: Repository<ApplicationEntity>,
		@InjectRepository(RecruitmentPostEntity)
		private readonly recruitmentPostRepo: Repository<RecruitmentPostEntity>,
	) {}

	async createApplication(
		user: User,
		postId: Uuid,
	): Promise<ApplicationEntity> {
		const recruitmentPost = await this.recruitmentPostRepo.findOne({
			where: { id: postId, active: true },
		});

		if (!recruitmentPost) {
			throw new NotFoundException('error.recruitment_post_not_found');
		}

		const existingApplication = await this.applicationRepo.findOne({
			where: { userId: user.id, recruitmentPostId: postId },
		});

		if (existingApplication) {
			throw new BadRequestException('error.application_already_applied');
		}

		const application = this.applicationRepo.create({
			user,
			recruitmentPost,
		});

		const savedApplication = await this.applicationRepo.save(application);
		return savedApplication;
	}

	async getApplicationById(id: Uuid, user: User): Promise<ApplicationEntity> {
		const application = await this.applicationRepo.findOne({
			where: { recruitmentPost: { id }, user: { id: user.id } },
			relations: ['user', 'recruitmentPost', 'recruitmentPost.pageUser'],
		});

		return application;
	}
}
