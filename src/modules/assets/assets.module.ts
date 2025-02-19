import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsService } from './assets.service';
import { AssetEntity } from './entities/asset.entity';
import { AwsS3Service } from '../../shared/services/aws-s3.service';

@Module({
	imports: [TypeOrmModule.forFeature([AssetEntity])],
	providers: [AssetsService, AwsS3Service],
	exports: [AssetsService],
})
export class AssetsModule {}
