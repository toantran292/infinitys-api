import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: { expiresIn: '3h' },
		}),
	],
	providers: [ChatsGateway, ChatsService],
	exports: [ChatsGateway],
})
export class ChatsModule {}
