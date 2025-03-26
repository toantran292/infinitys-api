import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { AssetEntity } from '../assets/entities/asset.entity';
import { User } from '../users/entities/user.entity';

import { PageUserEntity } from './entities/page-user.entity';
import { Page } from './entities/page.entity';
import { PagesAdminController } from './pages.admin.controller';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Page, User, PageUserEntity, AssetEntity]),
		AssetsModule,
	],
	controllers: [PagesController, PagesAdminController],
	providers: [PagesService],
	exports: [PagesService],
})
export class PagesModule {}
