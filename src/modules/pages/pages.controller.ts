import { Controller, Post, Body, UseGuards, Get, Req, Logger, UnauthorizedException } from '@nestjs/common';
import { PagesService } from './pages.service';
import { RegisterPageDto } from './dto/create-page.dto';
import { JwtAuthGuard } from '../auths/jwt-auth.guard';

@Controller('pages')
export class PagesController {
	logger = new Logger(PagesController.name);
	constructor(private readonly pagesService: PagesService) {}

	@Get()
	async getAllPages() {
		return this.pagesService.getAllPages();
	}

	@Get('my_pages')
	@UseGuards(JwtAuthGuard)
	async getMyPages(@Req() req) {
		this.logger.log(`🔍 User ID from request: ${req.user}`);
		console.dir(req.user, {depth: null})
		return this.pagesService.getMyPages(req.user.userId);
	}

	@Post('page')
	@UseGuards(JwtAuthGuard)
	async registerPage(@Req() req, @Body() registerPageDto: RegisterPageDto) {

		if (!req.user?.userId) {
			throw new UnauthorizedException('User not authenticated');
		}

		return this.pagesService.registerPage(req.user.userId, registerPageDto);
	}

}
