import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto, CreateCommentDto } from './dto/comment.dto';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';
import { RoleType } from 'src/constants/role-type';

@Controller('api/posts')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @SerializeOptions({
        type: CommentDto
    })
    @Get(':postId/comments')
    @Auth([RoleType.USER])
    async getCommentsByPostId(@UUIDParam('postId') postId: Uuid) {
        return this.commentsService.getCommentsByPostId(postId);
    }

    @SerializeOptions({
        type: CommentDto
    })
    @Post(':postId/comments')
    @Auth([RoleType.USER])
    async createComment(
        @AuthUser() user: UserEntity,
        @UUIDParam('postId') postId: Uuid,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.commentsService.createComment(user, { ...createCommentDto, postId });
    }
}