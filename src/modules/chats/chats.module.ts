import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { AuthsModule } from '../auths/auths.module';
import { PagesModule } from '../pages/pages.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ConversationReadStatus } from './entities/conversation-read-status.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Participant } from './entities/participant.entity';

@Module({
	imports: [
		AuthsModule,
		UsersModule,
		AssetsModule,
		PagesModule,
		TypeOrmModule.forFeature([
			User,
			Conversation,
			Message,
			Participant,
			ConversationReadStatus,
		]),
	],
	providers: [ChatsGateway, ChatsService],
	controllers: [ChatsController],
	exports: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
