import {
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	SerializeOptions,
	Body,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decoractors/http.decorators';

import {
	PaginationPageResponseDto,
	AdminPaginationPageUserResponseDto,
} from './dto/list-page-response.dto';
import { PagePageOptionsDto } from './dto/page-page-options.dto';
import { PagesService } from './pages.service';
import { PageResponseDto } from './dto/page-response.dto';
import { AdminUpdatePageDto } from './dto/update-page.dto';

@Controller('admin_api/pages')
export class PagesAdminController {
	constructor(private readonly pagesService: PagesService) {}

	@SerializeOptions({
		type: PaginationPageResponseDto,
	})
	@Get()
	@Auth([RoleType.ADMIN])
	async getPages(@Query() pagePageOptionsDto: PagePageOptionsDto) {
		return this.pagesService.getPages(pagePageOptionsDto, false);
	}

	@SerializeOptions({
		type: PageResponseDto,
	})
	@Get(':pageId')
	@Auth([RoleType.ADMIN])
	async getPage(@Param('pageId') pageId: Uuid) {
		return this.pagesService.getPage(pageId);
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

	@Patch(':pageId')
	@Auth([RoleType.ADMIN])
	async updatePage(
		@Param('pageId') pageId: Uuid,
		@Body() updatePageDto: AdminUpdatePageDto,
	) {
		return this.pagesService.updatePage(pageId, updatePageDto);
	}

	@SerializeOptions({
		type: AdminPaginationPageUserResponseDto,
	})
	@Get(':pageId/users')
	@Auth([RoleType.ADMIN])
	async getUsers(
		@Param('pageId') pageId: Uuid,
		@Query() pagePageOptionsDto: PagePageOptionsDto,
	) {
		return this.pagesService.getUsers(pageId, pagePageOptionsDto);
	}
}
