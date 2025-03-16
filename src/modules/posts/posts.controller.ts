import { Body, Controller, Post } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Auth } from "src/decoractors/http.decorators";
import { AuthUser } from "src/decoractors/auth-user.decorators";
import { RoleType } from "src/constants/role-type";
import { UserEntity } from "../users/entities/user.entity";

@Controller('api/posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @Auth([RoleType.USER])
    async createPost(@AuthUser() author: UserEntity, @Body() createPostDto: CreatePostDto) {
        return this.postsService.createPost(author, createPostDto);
    }
}
