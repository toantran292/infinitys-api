import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { getAssetFields } from '../../decoractors/asset.decoractor';
import { AwsS3Service } from '../../shared/services/aws-s3.service';

import { PresignLinkDto } from './dto/presign-link.dto';
import { AssetEntity } from './entities/asset.entity';

export enum FileType {
	AVATAR = 'avatar',
	BANNER = 'banner',
	IMAGE = 'image',
	TESTCASE = 'testcase',
}

export interface FileData {
	key: string;
	size: number;
	name: string;
	content_type: string;
}

export interface AddAssetInput {
	type: string;
	file_data: FileData;
}

@Injectable()
export class AssetsService {
	constructor(
		@InjectRepository(AssetEntity)
		private readonly assetRepository: Repository<AssetEntity>,
		private readonly awsS3Service: AwsS3Service,
	) {}

	async findAssetById(id: Uuid, owner_id: Uuid, owner_type: string) {
		return this.assetRepository.findOne({
			where: { id, owner_id, owner_type },
		});
	}

	async findAssetsByIds(ids: Uuid[], owner_id: Uuid, owner_type: string) {
		return this.assetRepository.find({
			where: { id: In(ids), owner_id, owner_type },
		});
	}

	async deleteAsset(id: Uuid, owner_id: Uuid, owner_type: string) {
		const asset = await this.assetRepository.findOne({
			where: { id, owner_id, owner_type },
		});

		if (!asset) return;

		await this.awsS3Service.deleteObject(asset.file_data.key);
		await this.assetRepository.remove(asset);
	}

	async deleteAssets(ids: Uuid[], owner_id: Uuid, owner_type: string) {
		const assets = await this.findAssetsByIds(ids, owner_id, owner_type);
		await Promise.all(
			assets.map((asset) => this.deleteAsset(asset.id, owner_id, owner_type)),
		);
	}

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

	async getPresignUrls(data: PresignLinkDto[]) {
		const keys = await Promise.all(
			data.map(async (d) => this.generateKey(d.type, d.suffix)),
		);
		const result = await this.awsS3Service.getPreSignedUrlToUploadObjects(keys);
		return keys.map((key, index) => {
			return {
				key,
				url: result[key],
			};
		});
	}

	async getViewUrl(key: string): Promise<{ url: string }> {
		if (!key) return { url: null };
		const url = await this.awsS3Service.getPreSignedUrlToViewObject(key);
		return { url };
	}

	async addAssetToEntity<T extends AbstractEntity>(
		entity: T,
		input: AddAssetInput,
	): Promise<T> {
		const { file_data, type } = input;

		const assetFields = getAssetFields(entity);
		const field = assetFields.find((field) => field.type === type);

		if (!field) {
			throw new BadRequestException('Invalid asset type');
		}

		let asset: AssetEntity;

		if (field.multiple) {
			const existingByKey = await this.assetRepository
				.createQueryBuilder('asset')
				.where(`asset.file_data->>'key' = :key`, {
					key: file_data.key,
				})
				.getOne();

			if (existingByKey) {
				existingByKey.owner_id = entity.id;
				existingByKey.owner_type = entity.entityType;
				existingByKey.type = type;
				asset = await this.assetRepository.save(existingByKey);
			} else {
				asset = await this.assetRepository.save(
					this.assetRepository.create({
						type,
						owner_type: entity.entityType,
						owner_id: entity.id,
						file_data,
					}),
				);
			}

			const signedUrl = await this.awsS3Service.getSignedUrlToViewObjects([
				asset.file_data.key,
			]);

			if (!Array.isArray(entity[field.propertyKey])) {
				entity[field.propertyKey] = [];
			}

			entity[field.propertyKey].push({
				...asset,
				url: signedUrl[asset.file_data.key],
			});
		} else {
			const existingByKey = await this.assetRepository
				.createQueryBuilder('asset')
				.where(`asset.file_data->>'key' = :key`, {
					key: file_data.key,
				})
				.getOne();

			const existingByOwner = await this.assetRepository.findOne({
				where: {
					owner_id: entity.id,
					owner_type: entity.entityType,
					type,
				},
			});

			if (existingByKey) {
				existingByKey.owner_id = entity.id;
				existingByKey.owner_type = entity.entityType;
				existingByKey.type = type;
				asset = await this.assetRepository.save(existingByKey);

				if (existingByOwner && existingByOwner.id !== existingByKey.id) {
					await this.assetRepository.remove(existingByOwner);
				}
			} else if (existingByOwner) {
				existingByOwner.file_data = file_data;
				asset = await this.assetRepository.save(existingByOwner);
			} else {
				asset = await this.assetRepository.save(
					this.assetRepository.create({
						type,
						owner_type: entity.entityType,
						owner_id: entity.id,
						file_data,
					}),
				);
			}

			const signedUrl = await this.awsS3Service.getSignedUrlToViewObjects([
				asset.file_data.key,
			]);

			entity[field.propertyKey] = {
				...asset,
				url: signedUrl[asset.file_data.key],
			};
		}

		return entity;
	}

	async addAssetsToEntity<T extends AbstractEntity>(
		entity: T,
		inputs: AddAssetInput[],
	): Promise<T> {
		if (!entity || !inputs.length) return entity;

		const assetFields = getAssetFields(entity);
		const fieldsToProcess = assetFields.filter((f) =>
			inputs.some((i) => i.type === f.type),
		);

		if (!fieldsToProcess.length) return entity;

		const groupedInputs = new Map<string, AddAssetInput[]>();
		for (const input of inputs) {
			const list = groupedInputs.get(input.type) ?? [];
			list.push(input);
			groupedInputs.set(input.type, list);
		}

		for (const field of fieldsToProcess) {
			const items = groupedInputs.get(field.type) ?? [];

			if (field.multiple) {
				const existingAssets = await this.assetRepository
					.createQueryBuilder('asset')
					.where(`asset.file_data->>'key' IN (:...keys)`, {
						keys: items.map((item) => item.file_data.key),
					})
					.getMany();

				const existingAssetMap = new Map(
					existingAssets.map((asset) => [asset.file_data.key, asset]),
				);

				const assetsToSave = await Promise.all(
					items.map(async (item) => {
						const existing = existingAssetMap.get(item.file_data.key);
						if (existing) {
							existing.owner_id = entity.id;
							existing.owner_type = entity.entityType;
							existing.type = item.type;
							return existing;
						} else {
							return this.assetRepository.create({
								file_data: item.file_data,
								owner_id: entity.id,
								owner_type: entity.entityType,
								type: item.type,
							});
						}
					}),
				);

				const saved = await this.assetRepository.save(assetsToSave);
				const urls = await this.awsS3Service.getSignedUrlToViewObjects(
					saved.map((a) => a.file_data.key),
				);

				entity[field.propertyKey] = [
					...(entity[field.propertyKey] ?? []),
					...saved.map((a) => ({
						...a,
						url: urls[a.file_data.key],
					})),
				];
			} else {
				const input = items[0];
				if (!input) continue;

				const existingByKey = await this.assetRepository
					.createQueryBuilder('asset')
					.where(`asset.file_data->>'key' = :key`, {
						key: input.file_data.key,
					})
					.getOne();

				const existingByOwner = await this.assetRepository.findOne({
					where: {
						owner_id: entity.id,
						owner_type: entity.entityType,
						type: field.type,
					},
				});

				let asset: AssetEntity;

				if (existingByKey) {
					existingByKey.owner_id = entity.id;
					existingByKey.owner_type = entity.entityType;
					existingByKey.type = input.type;
					asset = await this.assetRepository.save(existingByKey);

					if (existingByOwner && existingByOwner.id !== existingByKey.id) {
						await this.assetRepository.remove(existingByOwner);
					}
				} else if (existingByOwner) {
					existingByOwner.file_data = input.file_data;
					asset = await this.assetRepository.save(existingByOwner);
				} else {
					asset = await this.assetRepository.save(
						this.assetRepository.create({
							file_data: input.file_data,
							owner_id: entity.id,
							owner_type: entity.entityType,
							type: input.type,
						}),
					);
				}

				const url = await this.awsS3Service.getSignedUrlToViewObjects([
					asset.file_data.key,
				]);
				entity[field.propertyKey] = {
					...asset,
					url: url[asset.file_data.key],
				};
			}
		}

		return entity;
	}

	/**
	 * Attaches signed URLs for assets to an array of entities by using their asset metadata
	 * @param entities Array of entities to attach assets to. Each entity must extend AbstractEntity
	 * @returns The same array of entities with asset URLs attached to their decorated fields
	 *
	 * @example
	 * // Attach avatar URLs to an array of users
	 * const users = await this.assetsService.attachAssetToEntities(userArray);
	 *
	 * // Each user's decorated fields will now have URLs:
	 * console.log(users[0].avatar.url); // https://...
	 */
	async attachAssetToEntities<T extends AbstractEntity>(
		entities: T[],
	): Promise<T[]> {
		if (!entities.length) return entities;

		const sample = entities[0];
		const entityType = sample.entityType;
		const assetFields = getAssetFields(sample);

		if (!assetFields.length) return entities;

		const assetTypes = assetFields.map((field) => field.type);
		const ids = Array.from(new Set(entities.map((e) => e.id)));

		const assets = await this.assetRepository.find({
			where: {
				owner_id: In(ids),
				owner_type: entityType,
				type: In(assetTypes),
			},
		});

		const keys = assets.map((asset) => asset.file_data.key);
		const signedUrls = await this.awsS3Service.getSignedUrlToViewObjects(keys);

		const assetMap = new Map<string, AssetEntity[]>();
		for (const asset of assets) {
			const key = `${asset.owner_id}_${asset.type}`;
			if (!assetMap.has(key)) assetMap.set(key, []);
			assetMap.get(key)!.push(asset);
		}

		for (const entity of entities) {
			for (const { propertyKey, type, multiple } of assetFields) {
				const key = `${entity.id}_${type}`;
				const matched = assetMap.get(key) ?? [];

				if (multiple) {
					entity[propertyKey] = matched.map((asset) => {
						const signedUrl = signedUrls[asset.file_data.key];
						return {
							...asset,
							url: signedUrl,
						};
					});
				} else {
					const asset = matched[0];
					if (asset) {
						entity[propertyKey] = {
							...asset,
							url: signedUrls[asset.file_data.key],
						};
					}
				}
			}
		}

		return entities;
	}

	/**
	 * Attaches signed URLs for assets to a single entity by using the entity's asset metadata
	 * @param entity The entity to attach assets to. Must extend AbstractEntity
	 * @returns The same entity with asset URLs attached to the decorated fields
	 */
	async attachAssetToEntity<T extends AbstractEntity>(entity: T): Promise<T> {
		if (!entity) return entity;
		await this.attachAssetToEntities([entity]);
		return entity;
	}
}
