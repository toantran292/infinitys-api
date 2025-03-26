import e, { query } from 'express';
import { CommentStatistics } from 'src/modules/comments/entities/comment-statistics.entity';
import { PostStatistics } from 'src/modules/posts/entities/post-statistics.entity';
import { ReactEntity } from 'src/modules/reacts/entities/react.entity';
import {
	createQueryBuilder,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	RemoveEvent,
	SelectQueryBuilder,
	UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class ReactSubscriber implements EntitySubscriberInterface<ReactEntity> {
	listenTo() {
		return ReactEntity;
	}

	async afterInsert(event: InsertEvent<ReactEntity>) {
		const { manager, entity } = event;

		if (entity.targetType === 'posts') {
			let query = manager
				.createQueryBuilder()
				.insert()
				.into(PostStatistics)
				.values({
					postId: entity.targetId,
					reactCount: 1,
				})
				.orUpdate(['react_count'], ['post_id'])
				.setParameter('react_count', `react_count + 1`);

			await query.execute();
		} else {
			const query = manager
				.createQueryBuilder()
				.insert()
				.into(CommentStatistics)
				.values({
					commentId: entity.targetId,
					reactCount: 1,
				})
				.orUpdate(['react_count'], ['comment_id'])
				.setParameter('react_count', `react_count + 1`);

			await query.execute();
		}
	}

	async afterUpdate(event: UpdateEvent<ReactEntity>) {
		const { manager, entity } = event;

		let query: any = manager.createQueryBuilder();

		if (entity.targetType === 'posts') {
			query = query
				.update(PostStatistics)
				.where('postId = :postId', { postId: entity.targetId });
		} else {
			query = query
				.update(CommentStatistics)
				.where('commentId = :commentId', { commentId: entity.targetId });
		}

		query = query.set({
			reactCount: () => {
				if (entity.isActive) {
					return `reactCount + 1`;
				} else {
					return `reactCount - 1`;
				}
			},
		});

		if (!entity.isActive) {
			query = query.andWhere('reactCount > 0');
		}

		await query.execute();
	}
}
