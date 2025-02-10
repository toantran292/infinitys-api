import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './configs/configuration.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import * as Joi from 'joi';
import { ClsModule } from 'nestjs-cls';
import { PagesModule } from './modules/pages/pages.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReactsModule } from './modules/reacts/reacts.module';
import { RecruitmentPostsModule } from './modules/recruitment_posts/recruitment_posts.module';
import { AssetsModule } from './modules/assets/assets.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ChatsModule } from './modules/chats/chats.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { AuthsModule } from './modules/auths/auths.module';

@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'staging')
					.default('development'),
				PORT: Joi.number().default(3000),
			}),
			validationOptions: {
				abortEarly: false,
			},
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			load: [databaseConfig],
			cache: true,
			expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DB_HOST', 'localhost'),
				port: configService.get<number>('DB_PORT', 5432),
				username: configService.get<string>('DB_USER', 'myuser'),
				password: configService.get<string>('DB_PASS', 'mypassword'),
				database: configService.get<string>('DB_NAME', 'mydatabase'),
				entities: [join(process.cwd(), 'dist/**/*.entity.js')],
				synchronize: false,
				autoLoadEntities: true,
				migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
				seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
				factories: [__dirname + '/factories/**/*{.ts,.js}'],
				cli: {
					migrationsDir: __dirname + '/migrations/',
				},
			}),
		}),
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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
