import {
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	RemoveEvent,
} from 'typeorm';

import { CommentEntity } from '../modules/comments/entities/comment.entity';
import { PostStatistics } from '../modules/posts/entities/post-statistics.entity';

@EventSubscriber()
export class CommentSubscriber
	implements EntitySubscriberInterface<CommentEntity>
{
	listenTo() {
		return CommentEntity;
	}

	async afterInsert(event: InsertEvent<CommentEntity>) {
		const { manager, entity } = event;

		await manager.query(
			`
            INSERT INTO post_statistics (post_id, comment_count)
            VALUES ($1, 1)
            ON CONFLICT (post_id) DO UPDATE
            SET comment_count = post_statistics.comment_count + 1
        `,
			[entity.post.id],
		);
	}

	async afterRemove(event: RemoveEvent<CommentEntity>) {
		const { manager, entity } = event;

		await manager
			.createQueryBuilder()
			.update(PostStatistics)
			.set({
				commentCount: () => `comment_count - 1`,
			})
			.where('postId = :postId', { postId: entity.post.id })
			.andWhere('commentCount > 0')
			.execute();
	}
}
