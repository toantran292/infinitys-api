import {
	Controller,
	Get,
	Param,
	Post,
	Query,
	SerializeOptions,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decoractors/http.decorators';
import { PagePageOptionsDto } from './dto/page-page-options.dto';
import { PaginationPageResponseDto } from './dto/list-page-response.dto';

@Controller('admin_api/pages')
export class PagesAdminController {
	constructor(private readonly pagesService: PagesService) {}

	@SerializeOptions({
		type: PaginationPageResponseDto,
	})
	@Get()
	@Auth([RoleType.ADMIN])
	async getPages(@Query() pagePageOptionsDto: PagePageOptionsDto) {
		return this.pagesService.getPages(pagePageOptionsDto);
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
