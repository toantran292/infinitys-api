import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { PageEntity } from './entities/page.entity';
import { UserEntity } from '../users/entities/user.entity';
import { PageUserEntity } from './entities/page-user.entity';
import { PagesAdminController } from './pages.admin.controller';

@Module({
	imports: [TypeOrmModule.forFeature([PageEntity, UserEntity, PageUserEntity])],
	controllers: [PagesController,PagesAdminController],
	providers: [PagesService],
})
export class PagesModule {}
