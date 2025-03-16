import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	GroupChatEntity,
	GroupChatMemberEntity,
	GroupChatMessageEntity,
} from './entities/chat.entity';
import { ChatsController } from './chats.controller';
import { UserEntity } from '../users/entities/user.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AuthsModule } from '../auths/auths.module';
import { UsersModule } from '../users/users.module';
import { AssetsModule } from '../assets/assets.module';
@Module({
	imports: [
		AuthsModule,
		UsersModule,
		AssetsModule,
		TypeOrmModule.forFeature([
			GroupChatEntity,
			GroupChatMemberEntity,
			GroupChatMessageEntity,
			UserEntity,
		]),
	],
	providers: [ChatsGateway, ChatsService],
	controllers: [ChatsController],
	exports: [ChatsGateway, ChatsService],
})
export class ChatsModule { }
