import { Controller, Get, Post, Query, SerializeOptions } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { NewsfeedService } from './newsfeed.service';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { CursorNewsfeedResponseDto } from './dto/newsfeed-response.dto';

@Controller('api/newsfeed')
export class NewsfeedController {
	constructor(private readonly newsfeedService: NewsfeedService) {}

	@SerializeOptions({
		type: CursorNewsfeedResponseDto,
	})
	@Get()
	@Auth()
	async getNewsfeed(
		@AuthUser() user: User,
		@Query('page') page?: number,
		@Query('limit') limit?: number,
		@Query('lastId') lastId?: string,
	) {
		return this.newsfeedService.getNewsfeed(user.id, {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
			lastId,
		});
	}

	@Post('rebuild')
	@Auth()
	async rebuildNewsfeed(@AuthUser() user: User) {
		await this.newsfeedService.rebuildNewsfeedForUser(user.id);
		return { success: true, message: 'Newsfeed rebuilt successfully' };
	}

	@Post('items/:id/seen')
	@Auth()
	async markAsSeen(
		@AuthUser() user: User,
		@UUIDParam('id') newsfeedItemId: Uuid,
	) {
		await this.newsfeedService.markItemAsSeen(user.id, newsfeedItemId);
		return { success: true };
	}

	@Get('new')
	@Auth()
	async getNewPostsCount(@AuthUser() user: User) {
		const count = await this.newsfeedService.getNewPostsCount(user.id);
		return { count };
	}

	@Post('refresh')
	@Auth()
	async refreshNewsfeed(@AuthUser() user: User) {
		const newPosts = await this.newsfeedService.getLatestPosts(user.id);
		return { posts: newPosts };
	}
}
