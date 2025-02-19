import {join} from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import parse from 'parse-duration';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';
import { UserSubscriber } from '../../entity-subscribers/user-subscriber';

@Injectable()
export class ApiConfigService {
	constructor(private readonly configService: ConfigService) {}

	get isDevelopment(): boolean {
		return this.nodeEnv === 'development';
	}

	get isProduction(): boolean {
		return this.nodeEnv === 'production';
	}

	get isTest(): boolean {
		return this.nodeEnv === 'test';
	}

	private getNumber(key: string): number {
		const value = this.get(key);

		try {
			return Number(value);
		} catch {
			throw new Error(`${key} environment variable is not a number`);
		}
	}

	// private getDuration(
	// 	key: string,
	// 	format?: Parameters<typeof parse>[1],
	// ): number {
	// 	const value = this.getString(key);
	// 	const duration = parse(value, format);
	//
	// 	if (duration === null) {
	// 		throw new Error(`${key} environment variable is not a valid duration`);
	// 	}
	//
	// 	return duration;
	// }

	private getBoolean(key: string): boolean {
		const value = this.get(key);

		try {
			return Boolean(JSON.parse(value));
		} catch {
			throw new Error(`${key} env var is not a boolean`);
		}
	}

	private getString(key: string): string {
		const value = this.get(key);

		return value.replaceAll(String.raw`\n`, '\n');
	}

	get nodeEnv(): string {
		return this.getString('NODE_ENV');
	}

	get postgresConfig(): TypeOrmModuleOptions {
		const entities = [
			join(__dirname, `../../modules/**/*.entity{.ts,.js}`),
			join(__dirname, `../../modules/**/*.view-entity{.ts,.js}`),
		];
		const migrations = [
			join(__dirname, `../../database/migrations/*{.ts,.js}`),
		];

		return {
			entities,
			migrations,
			dropSchema: this.isTest,
			type: 'postgres',
			host: this.getString('DB_HOST'),
			port: this.getNumber('DB_PORT'),
			username: this.getString('DB_USERNAME'),
			password: this.getString('DB_PASSWORD'),
			database: this.getString('DB_DATABASE'),
			subscribers: [UserSubscriber],
			migrationsRun: true,
			logging: this.getBoolean('ENABLE_ORM_LOGS'),
			namingStrategy: new SnakeNamingStrategy(),
		};
	}

	get awsS3Config() {
		return {
			accessKeyId: this.getString('AWS_S3_ACCESS_KEY_ID'),
			secretAccessKey: this.getString('AWS_S3_SECRET_ACCESS_KEY'),
			endpoint: this.getString('AWS_S3_ENDPOINT'),
			bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
			bucketName: this.getString('AWS_S3_BUCKET_NAME'),
		};
	}

	get authConfig() {
		return {
			privateKey: this.getString('JWT_PRIVATE_KEY'),
			publicKey: this.getString('JWT_PUBLIC_KEY'),
			jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
		};
	}

	get appConfig() {
		return {
			port: this.getString('PORT'),
		};
	}

	private get(key: string): string {
		const value = this.configService.get<string>(key);

		if (value == null) {
			throw new Error(`${key} environment variable does not set`); // probably we should call process.exit() too to avoid locking the service
		}

		return value;
	}
}
