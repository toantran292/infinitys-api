import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { Page } from './entities/page.entity';
import { User } from '../users/entities/user.entity';
import { PageUserEntity } from './entities/page-user.entity';
import { PagesAdminController } from './pages.admin.controller';
import { AssetEntity } from '../assets/entities/asset.entity';
import { AssetsModule } from '../assets/assets.module';

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
