import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity } from './entities/asset.entity';

@Injectable()
export class AssetsService {
	constructor(
		@InjectRepository(AssetEntity)
		private readonly assetRepository: Repository<AssetEntity>,
	) {}
}
