import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { ProblemsModule } from '../problems/problems.module';

@Module({
	imports: [ProblemsModule],
	controllers: [WebhooksController],
})
export class WebhooksModule {}
