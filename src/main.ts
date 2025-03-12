import './boilerplate.polyfill';

import {
	ClassSerializerInterceptor,
	HttpStatus,
	UnprocessableEntityException,
	ValidationPipe,
	Logger,
} from '@nestjs/common';
import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';

import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';

export async function bootstrap(): Promise<NestExpressApplication> {
	initializeTransactionalContext();
	const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
		new ExpressAdapter(),
		{ cors: true },
	);
	app.use(helmet());
	app.use(compression());

	// Định nghĩa format morgan đúng cách
	morgan.token('error', (req, res: any) => {
		return res.error ? res.error.message : '';
	});

	app.use(
		morgan(
			':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
			{
				skip: (req, res) => res.statusCode < 400,
				stream: {
					write: (message) => Logger.error(message.trim()),
				},
			},
		),
	);
	app.enableVersioning();

	const reflector = app.get(Reflector);
	const httpAdapter = app.get(HttpAdapterHost);

	app.useGlobalFilters(
		new AllExceptionsFilter(httpAdapter),
		new HttpExceptionFilter(reflector),
		new QueryFailedFilter(reflector),
	);

	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			transform: true,
			dismissDefaultMessages: true,
			exceptionFactory: (errors) => new UnprocessableEntityException(errors),
		}),
	);

	const configService = app.select(SharedModule).get(ApiConfigService);

	const port = configService.appConfig.port;

	await app.listen(port);

	return app;
}

export const viteNodeApp = bootstrap();
