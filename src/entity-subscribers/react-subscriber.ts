import { PostStatistics } from "src/modules/posts/entities/post-statistics.entity";
import { ReactEntity } from "src/modules/reacts/entities/react.entity";
import { createQueryBuilder, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";

@EventSubscriber()
export class ReactSubscriber implements EntitySubscriberInterface<ReactEntity> {
    listenTo() {
        return ReactEntity;
    }

    async afterInsert(event: InsertEvent<ReactEntity>) {
        const { manager, entity } = event;
        if (entity.targetType !== "posts") return;

        await manager
            .createQueryBuilder()
            .insert()
            .into(PostStatistics)
            .values({
                postId: entity.targetId,
                reactCount: 1,
            })
            .orUpdate(['reactCount'], ['postId'])
            .setParameter('reactCount', () => `reactCount + 1`)
            .execute();
    }

    async afterUpdate(event: UpdateEvent<ReactEntity>) {
        const { manager, entity } = event;
        if (entity.targetType !== "posts") return;

        console.log(entity.isActive);

        const query = manager
            .createQueryBuilder()
            .update(PostStatistics)
            .set({
                reactCount: () => {
                    if (entity.isActive) {
                        return `reactCount + 1`
                    } else {
                        return `reactCount - 1`
                    }
                }
            })
            .where('postId = :postId', { postId: entity.targetId })


        console.log(query.getQueryAndParameters());

        await query.execute();
    }

    async afterRemove(event: RemoveEvent<ReactEntity>) {
        const { manager, entity } = event;
        if (entity.targetType !== "posts") return;

        await manager
            .createQueryBuilder()
            .update(PostStatistics)
            .set({
                reactCount: () => `reactCount - 1`
            })
            .where('postId = :postId', { postId: entity.targetId })
            .andWhere('reactCount > 0')
            .execute();
    }
}