import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction } from "typeorm";
import { CommentEntity } from "./entities/comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { PostEntity } from "../posts/entities/post.entity";
import { UserEntity } from "../users/entities/user.entity";
import { AssetsService, FileType } from "../assets/assets.service";
import { Transactional } from "typeorm-transactional";
import { PostStatistics } from "../posts/entities/post-statistics.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly assetsService: AssetsService,
        @InjectRepository(PostStatistics)
        private readonly postStatisticsRepository: Repository<PostStatistics>,
    ) { }

    @Transactional()
    async createComment(user: UserEntity, createCommentDto: CreateCommentDto) {
        const { content, postId } = createCommentDto;

        const post = await this.postRepository
            .createQueryBuilder('post')
            .setLock('pessimistic_write')
            .where('post.id = :postId', { postId })
            .getOne();

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comment = this.commentRepository.create({
            content,
            post,
            user,
        });

        const savedComment = await this.commentRepository.save(comment);

        await this.postStatisticsRepository
            .createQueryBuilder()
            .update(PostStatistics)
            .set({
                commentCount: () => 'comment_count + 1'
            })
            .where('post_id = :postId', { postId })
            .execute();

        return savedComment;
    }

    async getCommentsByPostId(postId: Uuid) {
        const queryBuilder = this.commentRepository.createQueryBuilder('comment');

        queryBuilder
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.post', 'post')
            .where('post.id = :postId', { postId })
            .orderBy('comment.createdAt', 'DESC');

        const comments = await queryBuilder.getMany();

        await Promise.all(comments.map(async (comment) => {
            if (comment.user) {
                comment.user = await this.assetsService.populateAsset(comment.user, 'users', [FileType.AVATAR]);
            }
        }));

        return comments;
    }
}