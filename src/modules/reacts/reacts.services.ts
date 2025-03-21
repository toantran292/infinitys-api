import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { ReactEntity } from "./entities/react.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { CreateReactDto, REACT_TARGET_TYPE } from "./dto/create-react.dto";
import { PostStatistics } from "../posts/entities/post-statistics.entity";
import { CommentsService } from "../comments/comments.service";
import { ReactStatus } from "../comments/interfaces/react-status.interface";
import { CommentStatistics } from "../comments/entities/comment-statistics.entity";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class ReactsService {
    constructor(
        @InjectRepository(ReactEntity)
        private readonly reactRepository: Repository<ReactEntity>,
        private readonly dataSource: DataSource,
        private readonly commentsService: CommentsService
    ) { }

    async findReact(user: UserEntity, data: CreateReactDto) {
        const { targetId, targetType } = data;
        const react = await this.reactRepository.findOne({
            where: { user: { id: user.id }, targetId, targetType },
        });
        return react;
    }

    async getReactByTargetId(user: UserEntity, targetId: Uuid, targetType: REACT_TARGET_TYPE): Promise<ReactEntity> {
        const react = await this.findReact(user, { targetId, targetType });

        return react;
    }

    @Transactional()
    async createReact(user: UserEntity, createReactDto: CreateReactDto) {
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

        const delta = savedReact.isActive ? 1 : -1;

        if (targetType === REACT_TARGET_TYPE.POST) {
            await this.reactRepository.manager
                .createQueryBuilder()
                .update(PostStatistics)
                .set({
                    reactCount: () => `react_count + ${delta}`,
                })
                .where("post_id = :postId", { postId: targetId })
                .execute();
        } else if (targetType === REACT_TARGET_TYPE.COMMENT) {
            await this.reactRepository.manager
                .createQueryBuilder()
                .update(CommentStatistics)
                .set({
                    reactCount: () => `react_count + ${delta}`,
                })
                .where("commentId = :commentId", { commentId: targetId })
                .execute();
        }

        return savedReact;
    }
}
