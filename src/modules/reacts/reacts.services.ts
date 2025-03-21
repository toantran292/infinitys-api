import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { ReactEntity } from "./entities/react.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { CreateReactDto, REACT_TARGET_TYPE } from "./dto/create-react.dto";
import { PostStatistics } from "../posts/entities/post-statistics.entity";

@Injectable()
export class ReactsService {
    constructor(
        @InjectRepository(ReactEntity)
        private readonly reactRepository: Repository<ReactEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async findReact(user: UserEntity, data: CreateReactDto) {
        const { targetId, targetType } = data;
        const react = await this.reactRepository.findOne({
            where: {
                user: { id: user.id },
                targetId,
                targetType,
            },
        });
        return react;
    }

    async createReact(user: UserEntity, createReactDto: CreateReactDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingReact = await this.findReact(user, createReactDto);
            const { targetId, targetType } = createReactDto;

            let savedReact: ReactEntity;

            if (existingReact) {
                existingReact.isActive = !existingReact.isActive;
                savedReact = await queryRunner.manager.save(existingReact);
            } else {
                const newReact = this.reactRepository.create({
                    user,
                    targetId,
                    targetType,
                });
                savedReact = await queryRunner.manager.save(newReact);
            }

            if (targetType === REACT_TARGET_TYPE.POST) {
                const delta = savedReact.isActive ? 1 : -1;

                await queryRunner.manager
                    .createQueryBuilder()
                    .update(PostStatistics)
                    .set({
                        reactCount: () => `react_count + ${delta}`,
                    })
                    .where("post_id = :postId", { postId: targetId })
                    .execute();
            }

            await queryRunner.commitTransaction();
            return savedReact;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
