import { Module } from '@nestjs/common';

import { ProblemsModule } from '../problems/problems.module';

import { WebhooksController } from './webhooks.controller';

@Module({
	imports: [ProblemsModule],
	controllers: [WebhooksController],
})
export class WebhooksModule {}
