import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewsfeedService } from './newsfeed.service';

@Injectable()
export class NewsfeedScheduler {
	constructor(private readonly newsfeedService: NewsfeedService) {}

	// Cập nhật EdgeRank mỗi giờ một lần
	@Cron(CronExpression.EVERY_HOUR)
	async handleEdgeRankUpdate() {
		await this.newsfeedService.updateEdgeRanks();
	}
}
