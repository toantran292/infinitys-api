import { Injectable } from '@nestjs/common';

import { ApiConfigService } from './api-config.service';

@Injectable()
export class OJService {
	constructor(public configService: ApiConfigService) {}

	async submitProblem({
		problemId,
		submissionId,
		codeContent,
		language,
		timeLimit,
		memoryLimit,
	}) {
		const { endpoint, apiKey } = this.configService.ojConfig;

		const response = await fetch(`${endpoint}/api/submit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				problem_id: problemId,
				submission_id: submissionId,
				code_content: codeContent,
				language,
				time_limit: timeLimit,
				memory_limit: memoryLimit,
			}),
		});
	}
}
