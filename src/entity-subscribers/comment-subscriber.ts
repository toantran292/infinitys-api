import { CommentEntity } from "src/modules/comments/entities/comment.entity";
import { PostStatistics } from "src/modules/posts/entities/post-statistics.entity";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent } from "typeorm";

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<CommentEntity> {
    listenTo() {
        return CommentEntity;
    }

    async afterInsert(event: InsertEvent<CommentEntity>) {
        const { manager, entity } = event;

        await manager
            .createQueryBuilder()
            .insert()
            .into(PostStatistics)
            .values({
                postId: entity.post.id,
                commentCount: 1,
            })
            .orUpdate(['commentCount'], ['postId'])
            .setParameter('commentCount', () => `commentCount + 1`)
            .execute();
    }

    async afterRemove(event: RemoveEvent<CommentEntity>) {
        const { manager, entity } = event;

        await manager
            .createQueryBuilder()
            .update(PostStatistics)
            .set({
                commentCount: () => `commentCount - 1`
            })
            .where('postId = :postId', { postId: entity.post.id })
            .andWhere('commentCount > 0')
            .execute();
    }
}