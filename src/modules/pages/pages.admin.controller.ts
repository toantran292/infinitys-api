import {
	Controller,
	Get,
	Param,
	Post,
	Query,
	SerializeOptions,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { PagePageOptionsDto } from './dto/page-page-options.dto';
import { PaginationPageResponseDto } from './dto/list-page-response.dto';
import { PageResponseDto } from './dto/page-response.dto';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { PagesService } from './pages.service';
import type { User } from '../users/entities/user.entity';

@Controller('admin_api/pages')
export class PagesAdminController {
	constructor(private readonly pagesService: PagesService) {}

	@SerializeOptions({
		type: PaginationPageResponseDto,
	})
	@Get()
	@Auth([RoleType.ADMIN])
	async getPages(@Query() pagePageOptionsDto: PagePageOptionsDto) {
		return this.pagesService.getPendingPages(pagePageOptionsDto);
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Get(':id')
	@Auth([RoleType.ADMIN])
	async getPageById(
		@AuthUser() user: User,
		@UUIDParam('id') id: Uuid,
	) {
		const page = await this.pagesService.getPageById(user, id);
		return page;
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
