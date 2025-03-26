import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsS3Service } from '../../shared/services/aws-s3.service';

import { AssetsAdminController } from './assets.admin.controller';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { AssetEntity } from './entities/asset.entity';
@Module({
	imports: [TypeOrmModule.forFeature([AssetEntity])],
	controllers: [AssetsController, AssetsAdminController],
	providers: [AssetsService, AwsS3Service],
	exports: [AssetsService],
})
export class AssetsModule {}
