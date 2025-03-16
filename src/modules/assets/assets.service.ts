import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { AssetEntity } from './entities/asset.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PresignLinkDto } from './dto/presign-link.dto';
import { AvatarDto } from '../users/dto/avatar.dto';
import { AbstractEntity } from 'src/common/abstract.entity';

export enum FileType {
	AVATAR = 'avatar',
	BANNER = 'banner',
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

	private createAssetsMap(
		assets: AssetEntity[],
	): Record<string, Record<string, AssetEntity[]>> {
		return assets.reduce(
			(map, asset) => {
				map[asset.owner_id] ??= {};
				map[asset.owner_id][asset.type] ??= [];
				map[asset.owner_id][asset.type].push(asset);

				return map;
			},
			{} as Record<string, Record<string, AssetEntity[]>>,
		);
	}

	private async populateAssetUrl(asset: AssetEntity): Promise<AssetEntity> {
		if (!asset?.file_data?.key) return asset;

		const url = await this.awsS3Service.getPreSignedUrlToViewObject(
			asset.file_data.key,
		);

		asset.url = url;

		return asset;
	}

	async _populateAsset<T extends { [key: string]: any }>(
		entity: T,
		key: keyof T,
	): Promise<T> {
		if (!entity[key]) return entity;

		const assets = await Promise.all(
			entity[key].map(async (asset) => await this.populateAssetUrl(asset)),
		);
		entity[key] = assets as T[keyof T];
		return entity;
	}

	async populateAsset<E extends AbstractEntity>(
		entity: E,
		owner_type: string,
		types: FileType[],
	): Promise<E> {
		const assets = await this.assetRepository.find({
			where: { owner_id: entity.id, owner_type, type: In(types) },
		});

		const assetsMap = this.createAssetsMap(assets);
		const entityAssets = assetsMap[entity.id] || {};

		await Promise.all(
			types.map(async (type) => {
				entity[type] = entityAssets[type];
				await this._populateAsset(entity, type as keyof E);
			}),
		);

		return entity;
	}

	async populateAssets<E extends AbstractEntity>(
		entities: E[],
		owner_type: string,
		types: FileType[],
	): Promise<E[]> {
		if (!entities.length) return entities;

		const assets = await this.assetRepository.find({
			where: {
				owner_id: In(entities.map((entity) => entity.id)),
				owner_type,
				type: In(types),
			},
		});

		const assetsMap = this.createAssetsMap(assets);

		return Promise.all(
			entities.map(async (entity) => {
				const entityAssets = assetsMap[entity.id] || {};

				await Promise.all(
					types.map(async (type) => {
						entity[type] = entityAssets[type];
						await this._populateAsset(entity, type as keyof E);
					}),
				);

				return entity;
			}),
		);
	}

	async getViewUrl(key: string): Promise<{ url: string }> {
		const url = await this.awsS3Service.getPreSignedUrlToViewObject(key);
		return { url };
	}
}
