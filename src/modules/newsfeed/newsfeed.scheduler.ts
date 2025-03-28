import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewsfeedService } from './newsfeed.service';

@Injectable()
export class NewsfeedScheduler {
	constructor(private readonly newsfeedService: NewsfeedService) {}

	// Cập nhật EdgeRank mỗi 10s
	@Cron(CronExpression.EVERY_10_SECONDS)
	async handleEdgeRankUpdate() {
		await this.newsfeedService.updateEdgeRanks();
		console.log('EdgeRank updated');
	}
}
