import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Auth } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { PresignLinkDto } from './dto/presign-link.dto';

@Controller('admin_api/assets')
export class AssetsAdminController {
	constructor(private readonly assetsService: AssetsService) {}

	@Post('presign-link')
	@Auth([RoleType.ADMIN])
	async getPresignLink(@Body() body: PresignLinkDto) {
		return this.assetsService.getPresignUrl(body);
	}

	@Post('presign-links')
	@Auth([RoleType.ADMIN])
	async getPresignLinks(@Body() body: PresignLinkDto[]) {
		if (!Array.isArray(body) || body.length === 0) {
			throw new BadRequestException('Body must be an array of PresignLinkDto');
		}
		// Xử lý song song tất cả các requests
		const presignedUrls = await Promise.all(
			body.map((dto) => this.assetsService.getPresignUrl(dto)),
		);
		return presignedUrls;
	}

	@Get('view-url')
	@Auth([RoleType.ADMIN])
	async getViewUrl(@Query('key') key: string) {
		if (!key) {
			throw new BadRequestException('Key is required');
		}
		return this.assetsService.getViewUrl(key);
	}
}
