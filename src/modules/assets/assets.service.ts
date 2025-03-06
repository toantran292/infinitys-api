import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { AssetEntity } from './entities/asset.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PresignLinkDto } from './dto/presign-link.dto';
import { AvatarDto } from '../users/dto/avatar.dto';

export enum FileType {
	AVATAR = 'avatar',
}

@Injectable()
export class AssetsService {
	constructor(
		@InjectRepository(AssetEntity)
		private readonly assetRepository: Repository<AssetEntity>,
		private readonly awsS3Service: AwsS3Service,
	) { }

	async generateKey(type: FileType, suffix: string) {
		return `${type}/${suffix}`;
	}

	async getPresignUrl(
		data: PresignLinkDto,
	): Promise<{ url: string; key: string }> {
		const key = await this.generateKey(data.type, data.suffix);

		const url = await this.awsS3Service.getPreSignedUrl(key);

		return { url, key };
	}

	async create_or_update(
		type: FileType,
		owner_type: string,
		owner_id: Uuid,
		file_data: AvatarDto,
	) {
		const existingAsset = await this.assetRepository.findOne({
			where: { type, owner_type, owner_id },
		});

		const asset =
			existingAsset ||
			this.assetRepository.create({
				type,
				owner_type,
				owner_id,
			});

		asset.file_data = file_data;
		return this.assetRepository.save(asset);
	}

	async populateAsset<T extends { [key: string]: any }>(
		entity: T,
		key: string,
	): Promise<T> {
		if (!entity[key]) return entity;

		const asset = entity[key];
		if (!asset || !asset.file_data?.key) return entity;

		const url = await this.awsS3Service.getPreSignedUrlToViewObject(
			asset.file_data.key,
		);

		(entity as any)[key] = {
			...asset,
			url,
		};

		return entity;
	}
}
