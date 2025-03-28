import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	SerializeOptions,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth } from '../../decoractors/http.decorators';
import { AvatarDto } from '../users/dto/avatar.dto';

import { RegisterPageDto } from './dto/create-page.dto';
import { PaginationPageResponseDto } from './dto/list-page-response.dto';
import { PagePageOptionsDto } from './dto/page-page-options.dto';
import { PageResponseDto } from './dto/page-response.dto';
import { PagesService } from './pages.service';

import type { User } from '../users/entities/user.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PaginationApplicationResponseDto } from '../applications/dtos/list-application-response.dto';
@Controller('api/pages')
export class PagesController {
	constructor(private readonly pagesService: PagesService) {}

	@SerializeOptions({
		type: PaginationPageResponseDto,
	})
	@Get()
	@Auth([RoleType.USER])
	async getPages(@Query() pagePageOptionsDto: PagePageOptionsDto) {
		return this.pagesService.getPages(pagePageOptionsDto);
	}

	@SerializeOptions({
		type: PaginationPageResponseDto,
	})
	@Get('me')
	@Auth([RoleType.USER])
	async getMyPages(
		@AuthUser() user: User,
		@Query() pagePageOptionsDto: PagePageOptionsDto,
	) {
		return this.pagesService.getMyPages(user, pagePageOptionsDto);
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Get('/working')
	@Auth([RoleType.USER])
	async getWorkingPage(@AuthUser() user: User) {
		return this.pagesService.getWorkingPage(user, {});
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Get(':pageId')
	@Auth([RoleType.USER, RoleType.ADMIN])
	async getPageById(@AuthUser() user: User, @Param('pageId') pageId: Uuid) {
		const page = await this.pagesService.getPageById(user, pageId);
		return page;
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Post('register')
	@Auth([RoleType.USER])
	async registerPage(
		@AuthUser() user: User,
		@Body() registerPageDto: RegisterPageDto,
	) {
		return this.pagesService.registerPage(user, registerPageDto);
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Post(':pageId/re-register')
	@Auth([RoleType.USER])
	async reRegisterPage(@AuthUser() user: User, @Param('pageId') pageId: Uuid) {
		return this.pagesService.reRegisterPage(user, pageId);
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Patch('/:id/avatar')
	@Auth([RoleType.USER])
	async updateAvatarPage(
		@Param('id') pageId: Uuid,
		@Body('avatar') avatar: AvatarDto,
	) {
		return this.pagesService.updateAvatarPage(pageId, avatar);
	}

	@SerializeOptions({
		type: PaginationApplicationResponseDto,
	})
	@Get(':pageId/recruitment-posts/:postId/applications')
	@Auth([RoleType.USER])
	async getApplication(
		@AuthUser() user: User,
		@Param('pageId') pageId: Uuid,
		@Param('postId') postId: Uuid,
		@Query() pageOptionsDto: PageOptionsDto,
	) {
		return this.pagesService.getApplicationsByPostId(
			user,
			pageId,
			postId,
			pageOptionsDto,
		);
	}
}
