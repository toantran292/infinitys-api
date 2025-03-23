import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Query,
	SerializeOptions,
} from '@nestjs/common';
import { RecruitmentPostsService } from './recruitment_posts.service';
import { AuthUser } from 'src/decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';
import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { Auth } from 'src/decoractors/http.decorators';
import { RoleType } from 'src/constants/role-type';
import { RecruitmentPostDto } from './dto/recruitment-post.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { RecruitmentPostEntity } from './entities/recruitment_post.entity';
import { PaginationRecruitmentPostResponseDto } from './dto/list-recruitment-post-response.dto';
import { RecruitmentPostResponseDto } from './dto/recruitment-post-response.dto';
import { PaginationApplicationResponseDto } from '../applications/dtos/list-application-response.dto';
@Controller('api/recruitment-posts')
export class RecruitmentPostsController {
	constructor(
		private readonly recruitmentPostsService: RecruitmentPostsService,
	) {}

	@SerializeOptions({
		type: PaginationRecruitmentPostResponseDto,
	})
	@Get()
	async getAllPosts(
		@Query() pageOptionsDto: PageOptionsDto,
	): Promise<[RecruitmentPostEntity[], number]> {
		return this.recruitmentPostsService.getAllPosts(pageOptionsDto);
	}

	@SerializeOptions({
		type: RecruitmentPostResponseDto,
	})
	@Get(':id')
	async getRecruitmentPost(
		@Param('id') id: string,
	): Promise<RecruitmentPostEntity> {
		return this.recruitmentPostsService.getRecruitmentPost(id);
	}

	@SerializeOptions({
		type: RecruitmentPostResponseDto,
	})
	@Post()
	@Auth([RoleType.USER])
	async createPost(
		@AuthUser() user: UserEntity,
		@Body() post: CreateRecruitmentPostDto,
	) {
		return this.recruitmentPostsService.createPost(user, post);
	}

	@SerializeOptions({
		type: PaginationRecruitmentPostResponseDto,
	})
	@Get('page/:pageId')
	async getPostsByPageId(
		@Param('pageId') pageId: string,
		@Query() pageOptionsDto: PageOptionsDto,
	) {
		return this.recruitmentPostsService.getPostsByPageId(
			pageId,
			pageOptionsDto,
		);
	}

	@SerializeOptions({
		type: PaginationApplicationResponseDto,
	})
	@Get(':id/applications')
	@Auth([RoleType.USER])
	async getApplicationsByPostId(
		@AuthUser() user: UserEntity,
		@Param('id') postId: string,
		@Query() pageOptionsDto: PageOptionsDto,
	) {
		return this.recruitmentPostsService.getApplicationsByPostId(
			user,
			postId,
			pageOptionsDto,
		);
	}
}
