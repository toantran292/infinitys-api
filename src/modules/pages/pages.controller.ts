import { Controller, Post, Body, Param, UseGuards, Get, Req, Logger, UnauthorizedException } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { JwtAuthGuard } from '../auths/jwt-auth.guard';

@Controller('pages')
export class PagesController {
	logger = new Logger(PagesController.name);
	constructor(private readonly pagesService: PagesService) {}
	@Get()
	async getAllPages() {
		console.log("Get all pages");
		return this.pagesService.getAllPages();
	}

	// 2️⃣ Lấy Pages mà người dùng sở hữu (Cần đăng nhập)
	@Get('my_pages')
	@UseGuards(JwtAuthGuard)
	async getMyPages(@Req() req) {
		this.logger.log(`🔍 User ID from request: ${req.user}`);
		console.dir(req.user, {depth: null})
		return this.pagesService.getMyPages(req.user.userId);
	}

	@Post('page')
	@UseGuards(JwtAuthGuard) // ✅ Yêu cầu đăng nhập để tạo page
	async createPage(@Req() req, @Body() createPageDto: CreatePageDto) {
		console.log(`🔍 User ID from request: ${req.user}`);

		if (!req.user?.userId) {
			throw new UnauthorizedException('User not authenticated');
		}

		return this.pagesService.createPage(req.user.userId, createPageDto);
	}

}
