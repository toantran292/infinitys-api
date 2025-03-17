import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "./entities/comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { PostEntity } from "../posts/entities/post.entity";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async createComment(user: UserEntity, createCommentDto: CreateCommentDto) {
        const { content, postId } = createCommentDto;

        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!post) {
            throw new NotFoundException('error.post_not_found');
        }

        const comment = this.commentRepository.create({
            content,
            post,
            user,
        });

        return this.commentRepository.save(comment);
    }


    async getCommentsByPostId(postId: Uuid) {
        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!post) {
            throw new NotFoundException('error.comment_not_found');
        }

        return this.commentRepository.find({
            where: { post },
        });
    }
}