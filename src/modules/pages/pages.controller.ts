import { Controller, Post, Body, Param } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';

@Controller('pages')
export class PagesController {
	constructor(private readonly pagesService: PagesService) {}

	@Post(':userId')
	async createPage(@Param('userId') userId: string, @Body() createPageDto: CreatePageDto) {
		return this.pagesService.createPage(userId, createPageDto);
	}
}
