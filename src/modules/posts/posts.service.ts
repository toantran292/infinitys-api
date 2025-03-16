import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { Repository } from "typeorm";
import { AssetsService } from "../assets/assets.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,

        private readonly assetsService: AssetsService,
    ) {

    }

    async createPost(author: UserEntity, createPostDto: CreatePostDto) {
        const { content, photoIds } = createPostDto;

        const post = this.postRepository.create({
            content,
            author,
        });

        const savedPost = await this.postRepository.save(post);

        return savedPost;
    }
}