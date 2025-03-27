import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { User } from '../users/entities/user.entity';

import { CommentsService } from './comments.service';
import { CommentDto, CreateCommentDto } from './dto/comment.dto';

@Controller('api/posts')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@SerializeOptions({
		type: CommentDto,
	})
	@Get(':postId/comments')
	@Auth([RoleType.USER])
	async getCommentsByPostId(@UUIDParam('postId') postId: Uuid) {
		return this.commentsService.getCommentsByPostId(postId);
	}

	@SerializeOptions({
		type: CommentDto,
	})
	@Post(':postId/comments')
	@Auth([RoleType.USER])
	async createComment(
		@AuthUser() user: User,
		@UUIDParam('postId') postId: Uuid,
		@Body() createCommentDto: CreateCommentDto,
	) {
		return this.commentsService.createComment(user, {
			...createCommentDto,
			postId,
		});
	}
}
