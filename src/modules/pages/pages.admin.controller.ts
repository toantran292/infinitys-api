import { Controller, Get, Param, Post } from '@nestjs/common';
import { PagesService } from './pages.service';
import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decoractors/http.decorators';

@Controller('api_admin/pages')
export class PagesAdminController {
	constructor(private readonly pagesService: PagesService) {}

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
