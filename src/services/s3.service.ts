import { Injectable } from '@nestjs/common';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
	private s3Client: S3Client;
	private bucketName: string;

	constructor(private readonly configService: ConfigService) {
		this.s3Client = new S3Client({
			region: this.configService.get<string>('AWS_REGION'),
			endpoint: this.configService.get<string>('AWS_ENDPOINT'),
			forcePathStyle: true,
			credentials: {
				accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.get<string>(
					'AWS_SECRET_ACCESS_KEY',
				),
			},
		});
		this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
	}

	private async getSignedUrlS3(command: any) {
		return getSignedUrl(this.s3Client, command, { expiresIn: 15 * 60 });
	}

	async getPreSignedUrl(key: string) {
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		return await this.getSignedUrlS3(command);
	}

	async getPreSignedUrlToViewObject(key: string) {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		return await this.getSignedUrlS3(command);
	}

	async getPreSignedUrlToDeleteObject(key: string) {
		const command = new DeleteObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		return await this.getSignedUrlS3(command);
	}
}
