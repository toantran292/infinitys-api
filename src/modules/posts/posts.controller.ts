import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Auth, UUIDParam } from 'src/decoractors/http.decorators';
import { AuthUser } from 'src/decoractors/auth-user.decorators';
import { RoleType } from 'src/constants/role-type';
import { User } from '../users/entities/user.entity';
import { PostDto } from './dto/post.dto';
import { AssetResponseDto } from '../users/dto/user-response.dto';
import { CreateAssetDto } from '../assets/dto/create-asset.dto';

@Controller('api/posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@SerializeOptions({
		type: PostDto,
	})
	@Post()
	@Auth([RoleType.USER])
	async createPost(
		@AuthUser() author: User,
		@Body() createPostDto: CreatePostDto,
	) {
		return this.postsService.createPost(author, createPostDto);
	}

	@SerializeOptions({
		type: PostDto,
	})
	@Get()
	@Auth([RoleType.USER])
	async getPosts() {
		return this.postsService.getPosts();
	}

	@SerializeOptions({
		type: PostDto,
	})
	@Get('me')
	@Auth([RoleType.USER])
	async getPostByUserId(@AuthUser() user: User) {
		return this.postsService.getPostByUserId(user.id);
	}

	@Post(':id/react')
	@Auth([RoleType.USER])
	async react(@AuthUser() user: User, @UUIDParam('id') id: Uuid) {
		return this.postsService.react(user, id);
	}

	@SerializeOptions({
		type: PostDto,
	})
	@Get('newsfeed')
	@Auth([RoleType.USER])
	async getNewsfeed(@AuthUser() user: User) {
		return this.postsService.getNewsfeed(user.id);
	}

	@Post(':id/upload-image')
	@Auth([RoleType.USER])
	async uploadImage(
		@AuthUser() user: User,
		@UUIDParam('id') id: Uuid,
		@Body('images') images: CreateAssetDto[],
	) {
		return this.postsService.uploadImages(user, id, images);
	}
}
