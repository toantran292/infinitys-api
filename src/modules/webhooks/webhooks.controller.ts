import { Controller, Post, Body } from '@nestjs/common';

import { ProblemsService } from '../problems/problems.service';
import { TestCaseResult } from '../problems/problems.type';

@Controller('webhooks')
export class WebhooksController {
	constructor(private readonly problemsService: ProblemsService) {}

	@Post('oj')
	async oj(
		@Body()
		body: {
			problem_id: Uuid;
			submission_id: Uuid;
			result: TestCaseResult[];
		},
	) {
		await this.problemsService.updateSubmission(
			body.submission_id,
			body.result,
		);
	}
}
