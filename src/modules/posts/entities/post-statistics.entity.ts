import { PostEntity } from "./post.entity";

import { JoinColumn, PrimaryColumn, OneToOne, Column } from "typeorm";

import { Entity } from "typeorm";

@Entity("post_statistics")
export class PostStatistics {
    @PrimaryColumn("uuid")
    postId: string;

    @OneToOne(() => PostEntity, (post) => post.statistics, { onDelete: "CASCADE" })
    @JoinColumn({ name: "postId" })
    post: PostEntity;

    @Column({ type: "int", default: 0 })
    commentCount: number;

    @Column({ type: "int", default: 0 })
    reactCount: number;
}
