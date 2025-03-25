import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsController } from './chats.controller';
import { User } from '../users/entities/user.entity';
import { AuthsModule } from '../auths/auths.module';
import { UsersModule } from '../users/users.module';
import { AssetsModule } from '../assets/assets.module';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Participant } from './entities/participant.entity';
import { ConversationReadStatus } from './entities/conversation-read-status.entity';
import { PagesModule } from '../pages/pages.module';
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
