import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { Auth, UUIDParam } from "src/decoractors/http.decorators";
import { UserEntity } from "../users/entities/user.entity";
import { AuthUser } from "src/decoractors/auth-user.decorators";
import { CreateCommentDto } from "./dto/create-comment.dto";



@Controller('api/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    async createComment(@AuthUser() user: UserEntity, @Body() createCommentDto: CreateCommentDto) {
        return this.commentsService.createComment(user, createCommentDto);
    }

    @Get(':postId')
    async getCommentsByPostId(@UUIDParam('postId') postId: Uuid) {
        return this.commentsService.getCommentsByPostId(postId);
    }
}