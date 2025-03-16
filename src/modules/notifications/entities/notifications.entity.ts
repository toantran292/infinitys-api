import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../common/abstract.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity('notifications')
export class NotificationEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
    user?: UserEntity;

    @Column({ type: 'jsonb', default: {} })
    meta?: Record<string, any>;

    @Column({ type: 'boolean', default: false })
    isReaded?: boolean;
}
