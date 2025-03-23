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

@Controller('api/assets')
export class AssetsController {
	constructor(private readonly assetsService: AssetsService) { }

	@Post('presign-link')
	@Auth([RoleType.USER])
	async getPresignLink(@Body() body: PresignLinkDto) {
		return this.assetsService.getPresignUrl(body);
	}

	@Post('presign-links')
	@Auth([RoleType.USER])
	async getPresignLinks(@Body() body: PresignLinkDto[]) {
		if (!Array.isArray(body) || body.length === 0) {
			throw new BadRequestException('Body must be an array of PresignLinkDto');
		}
		// Xử lý song song tất cả các requests
		const presignedUrls = await Promise.all(
			body.map(dto => this.assetsService.getPresignUrl(dto))
		);
		return presignedUrls;
	}

	@Get('view-url')
	@Auth([RoleType.USER])
	async getViewUrl(@Query('key') key: string) {
		if (!key) {
			throw new BadRequestException('Key is required');
		}
		return this.assetsService.getViewUrl(key);
	}

	// @Get()
	// async getAssets(owner_id: Uuid): Promise<AssetEntity> {
	// 	return await this.assetsService.getAsset(owner_id);
	// }
}
