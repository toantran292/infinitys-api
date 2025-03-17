import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactEntity } from './entities/react.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ReactsController } from './reacts.controller';
import { ReactsService } from './reacts.services';

@Module({
	imports: [TypeOrmModule.forFeature([
		ReactEntity,
		PostEntity,
		UserEntity,
	])],
	controllers: [
		ReactsController,
	],
	providers: [
		ReactsService,
	],
	exports: [
		ReactsService,
	],
})
export class ReactsModule { }
