import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
	ClassSerializerInterceptor,
	HttpStatus,
	Logger,
	UnprocessableEntityException,
	ValidationPipe,
} from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

export async function bootstrap(): Promise<NestApplication> {
	const logger = new Logger(bootstrap.name);

	const app = await NestFactory.create<NestApplication>(
		AppModule,
		new ExpressAdapter(),
		{ cors: true },
	);
	app.use(helmet());
	app.setGlobalPrefix('/api');
	app.use(compression());
	app.use(morgan('combined'));
	app.enableVersioning();

	const reflector = app.get(Reflector);

	app.useGlobalFilters(
		new HttpExceptionFilter(reflector),
		new QueryFailedFilter(reflector),
	);

	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			dismissDefaultMessages: true,
		}),
	);

	app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

	const configService = app.get(ConfigService);

	const port = configService.get('PORT');

	await app.listen(port);

	logger.log('Server is running on port ' + port);

	return app;
}

bootstrap();
