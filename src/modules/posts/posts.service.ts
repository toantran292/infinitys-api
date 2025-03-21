import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { Repository } from "typeorm";
import { AssetsService, FileType } from "../assets/assets.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UserEntity } from "../users/entities/user.entity";
import { PostStatistics } from "./entities/post-statistics.entity";
import { ReactsService } from "../reacts/reacts.services";
import { REACT_TARGET_TYPE } from "../reacts/dto/create-react.dto";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,

        @InjectRepository(PostStatistics)
        private readonly postStatisticsRepository: Repository<PostStatistics>,

        private readonly assetsService: AssetsService,

        private readonly reactsService: ReactsService,
    ) { }

    async createPost(author: UserEntity, createPostDto: CreatePostDto) {
        const { content } = createPostDto;

        const post = this.postRepository.create({
            content,
            author,
        });

        const savedPost = await this.postRepository.save(post);

        await this.postStatisticsRepository.save({
            postId: savedPost.id,
            commentCount: 0,
            reactCount: 0
        });

        return savedPost;
    }

    async getPosts() {
        return await this.postRepository.find({
            relations: ['author'],
        });
    }

    async getPostByUserId(userId: Uuid) {
        const queryBuilder = this.postRepository.createQueryBuilder('post');

        queryBuilder
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndMapOne('post.statistics', PostStatistics, 'stats', 'stats.postId = post.id')
            .where('author.id = :userId', { userId })
            .orderBy('post.createdAt', 'DESC')

        const posts = await queryBuilder.getMany();

        await Promise.all(posts.map(async (post) => {
            post.author = await this.assetsService.populateAsset(post.author, 'users', [FileType.AVATAR]);
        }));

        return posts;
    }

    async react(user: UserEntity, postId: Uuid) {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const react = await this.reactsService.createReact(user, {
            targetId: postId,
            targetType: REACT_TARGET_TYPE.POST,
        });

        return react;
    }
}