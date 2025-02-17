import { Module } from '@nestjs/common';
import { S3Service } from '../../services/s3.service';
import { AssetsService } from './assets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from './entities/asset.entity';

@Module({
	imports: [TypeOrmModule.forFeature([AssetEntity])],
	providers: [AssetsService, S3Service],
	exports: [AssetsService],
})
export class AssetsModule {}
