import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decoractors/http.decorators';
import { PagePageOptionsDto } from './dto/page-page-options.dto';
import { PageDto } from './dto/page.dto';
import type { PageDto as CommonPageDto } from '../../common/dto/page.dto';
import { UserEntity } from '../users/entities/user.entity';
import { AuthUser } from '../../decoractors/auth-user.decorators';

@Controller('admin_api/pages')
export class PagesAdminController {
	constructor(private readonly pagesService: PagesService) {}

	@Get()
	@Auth([RoleType.ADMIN])
	async getPages(
		@AuthUser() user: UserEntity,
		@Query() pagePageOptionsDto: PagePageOptionsDto,
	): Promise<CommonPageDto<PageDto>> {
		return this.pagesService.getPages(pagePageOptionsDto, user);
	}

	@Post(':pageId/approve')
	@Auth([RoleType.ADMIN])
	async approvePage(@Param('pageId') pageId: Uuid) {
		return this.pagesService.approvePage(pageId);
	}

	@Post(':pageId/reject')
	@Auth([RoleType.ADMIN])
	async rejectPage(@Param('pageId') pageId: Uuid) {
		return this.pagesService.rejectPage(pageId);
	}
}
