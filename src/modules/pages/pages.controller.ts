import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { RegisterPageDto } from './dto/create-page.dto';
import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decoractors/http.decorators';
import { PagePageOptionsDto } from './dto/page-page-options.dto';
import type { PageDto as CommonPageDto } from '../../common/dto/page.dto';
import type { PageDto } from './dto/page.dto';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import type { UserEntity } from '../users/entities/user.entity';
import { AvatarDto } from '../users/dto/avatar.dto';

@Controller('api/pages')
export class PagesController {
	constructor(private readonly pagesService: PagesService) { }

	@Get()
	@Auth([RoleType.USER])
	async getPages(
		@Query() pagePageOptionsDto: PagePageOptionsDto,
	): Promise<CommonPageDto<PageDto>> {
		return this.pagesService.getPages(pagePageOptionsDto);
	}

	@Get('me')
	@Auth([RoleType.USER])
	async getMyPages(
		@AuthUser() user: UserEntity,
		@Query() pagePageOptionsDto: PagePageOptionsDto,
	) {
		return this.pagesService.getMyPages(user, pagePageOptionsDto);
	}

	@Get(':pageId')
	@Auth([RoleType.USER, RoleType.ADMIN])
	async getPageById(
		@AuthUser() user: UserEntity,
		@Param('pageId') pageId: Uuid,
	) {
		const page = await this.pagesService.getPageById(user, pageId);
		return page.toDto<PageDto>();
	}

	@Post('register')
	@Auth([RoleType.USER])
	async registerPage(
		@AuthUser() user: UserEntity,
		@Body() registerPageDto: RegisterPageDto,
	) {
		return this.pagesService.registerPage(user, registerPageDto);
	}

	@Patch('/:id/avatar')
	@Auth([RoleType.USER])
	async updateAvatarPage(
		@Param('id') pageId: Uuid,
		@Body('avatar') avatar: AvatarDto,
	) {
		return this.pagesService.updateAvatarPage(pageId, avatar);
	}
}
