import { Body, Controller, Get, Post } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Auth, UUIDParam } from "src/decoractors/http.decorators";
import { AuthUser } from "src/decoractors/auth-user.decorators";
import { RoleType } from "src/constants/role-type";
import { UserEntity } from "../users/entities/user.entity";
import { PostDto } from "./dto/post.dto";

@Controller('api/posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @Auth([RoleType.USER])
    async createPost(@AuthUser() author: UserEntity, @Body() createPostDto: CreatePostDto) {
        return this.postsService.createPost(author, createPostDto);
    }

    @Get()
    @Auth([RoleType.USER])
    async getPosts() {
        return this.postsService.getPosts();
    }

    @Get('me')
    @Auth([RoleType.USER])
    async getPostByUserId(@AuthUser() user: UserEntity) {
        const posts = await this.postsService.getPostByUserId(user.id);

        return posts.map((post) => new PostDto(post));
    }

    @Post(':id/react')
    @Auth([RoleType.USER])
    async react(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
        return this.postsService.react(user, id);
    }
}
