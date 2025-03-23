import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { ApiConfigService } from './api-config.service';
import { GeneratorService } from './generator.service';
import { getSignedUrl as getSignedUrlS3 } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
	private readonly s3Client: S3Client;
	private readonly bucketName: string;

	constructor(
		public configService: ApiConfigService,
		public generatorService: GeneratorService,
	) {
		const config = configService.awsS3Config;

		this.s3Client = new S3Client({
			region: config.bucketRegion,
			endpoint: config.endpoint,
			forcePathStyle: true,
			credentials: {
				accessKeyId: config.accessKeyId,
				secretAccessKey: config.secretAccessKey,
			},
		});

		this.bucketName = config.bucketName;
	}

	private async getSignedUrl(command: any) {
		return getSignedUrlS3(this.s3Client, command, { expiresIn: 15 * 60 });
	}

	async getPreSignedUrl(key: string) {
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		return await this.getSignedUrl(command);
	}

	async getPreSignedUrlToViewObject(key: string) {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		return await this.getSignedUrl(command);
	}

	async getPreSignedUrlToDeleteObject(key: string) {
		const command = new DeleteObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		return await this.getSignedUrl(command);
	}

	async getSignedUrlToViewObjects(keys: string[]) {
		const urlMap: Record<string, string> = {};

		await Promise.all(
			keys.map(async (key) => {
				const url = await this.getPreSignedUrlToViewObject(key);
				urlMap[key] = url;
			}),
		);

		return urlMap;
	}
}
