import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";

@Entity('comment_statistics')
export class CommentStatistics {
    @PrimaryColumn('uuid')
    commentId: string;

    @Column({ default: 0 })
    reactCount: number;

    @OneToOne(() => CommentEntity, comment => comment.statistics)
    @JoinColumn({ name: 'commentId' })
    comment: CommentEntity;
} 