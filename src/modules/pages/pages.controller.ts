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
import { PagesService } from './pages.service';
import { RegisterPageDto } from './dto/create-page.dto';
import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decoractors/http.decorators';
import { PagePageOptionsDto } from './dto/page-page-options.dto';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import type { User } from '../users/entities/user.entity';
import { AvatarDto } from '../users/dto/avatar.dto';
import { PaginationPageResponseDto } from './dto/list-page-response.dto';
import { PageResponseDto } from './dto/page-response.dto';
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
	@Patch('/:id/avatar')
	@Auth([RoleType.USER])
	async updateAvatarPage(
		@Param('id') pageId: Uuid,
		@Body('avatar') avatar: AvatarDto,
	) {
		return this.pagesService.updateAvatarPage(pageId, avatar);
	}
}
