import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReactEntity } from './entities/react.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreateReactDto, REACT_TARGET_TYPE } from './dto/create-react.dto';
import { Transactional } from 'typeorm-transactional';
import { PostEntity } from '../posts/entities/post.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CommentEntity } from '../comments/entities/comment.entity';
@Injectable()
export class ReactsService {
	constructor(
		@InjectRepository(ReactEntity)
		private readonly reactRepository: Repository<ReactEntity>,

		@InjectRepository(PostEntity)
		private readonly postRepository: Repository<PostEntity>,

		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>,

		private readonly notificationService: NotificationsService,
	) {}

	async findReact(user: User, data: CreateReactDto) {
		const { targetId, targetType } = data;
		const react = await this.reactRepository.findOne({
			where: { user: { id: user.id }, targetId, targetType },
		});
		return react;
	}

	async getReactByTargetId(
		user: User,
		targetId: Uuid,
		targetType: REACT_TARGET_TYPE,
	): Promise<ReactEntity> {
		const react = await this.findReact(user, { targetId, targetType });

		return react;
	}

	@Transactional()
	async createReact(user: User, createReactDto: CreateReactDto) {
		const existingReact = await this.findReact(user, createReactDto);
		const { targetId, targetType } = createReactDto;

		let savedReact: ReactEntity;

		if (existingReact) {
			existingReact.isActive = !existingReact.isActive;
			savedReact = await this.reactRepository.save(existingReact);
		} else {
			const newReact = this.reactRepository.create({
				user,
				targetId,
				targetType,
			});
			savedReact = await this.reactRepository.save(newReact);
		}

		let authorId: Uuid;

		if (targetType === REACT_TARGET_TYPE.POST) {
			const post = await this.postRepository.findOne({
				where: { id: targetId },
				relations: ['author'],
			});
			authorId = post.author.id;
		} else {
			const comment = await this.commentRepository.findOne({
				where: { id: targetId },
				relations: ['user'],
			});
			authorId = comment.user.id;
		}

		if (savedReact.isActive && authorId !== user.id) {
			this.notificationService.sendNotificationToUser({
				userId: authorId,
				data: {
					event_name: 'react:created',
					meta: {
						targetType,
						targetId,
						reacterId: user.id,
					},
				},
			});
		}

		return savedReact;
	}
}
