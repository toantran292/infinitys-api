import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ClsModule } from 'nestjs-cls';

import { ApplicationsModule } from './modules/applications/applications.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AuthsModule } from './modules/auths/auths.module';
import { ChatsModule } from './modules/chats/chats.module';
import { CommentsModule } from './modules/comments/comments.module';
import { PagesModule } from './modules/pages/pages.module';
import { PostsModule } from './modules/posts/posts.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { ReactsModule } from './modules/reacts/reacts.module';
import { RecruitmentPostsModule } from './modules/recruitment_posts/recruitment_posts.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SearchModule } from './modules/search/search.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		TypeOrmModule.forRootAsync({
			imports: [SharedModule],
			inject: [ApiConfigService],
			useFactory: (configService: ApiConfigService) =>
				configService.postgresConfig,
			dataSourceFactory: (options) => {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				return Promise.resolve(
					addTransactionalDataSource(new DataSource(options)),
				);
			},
		}),
		SharedModule,
		UsersModule,
		PagesModule,
		PostsModule,
		CommentsModule,
		ReactsModule,
		RecruitmentPostsModule,
		AssetsModule,
		ApplicationsModule,
		ChatsModule,
		ProblemsModule,
		AuthsModule,
		SearchModule,
		NotificationsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
