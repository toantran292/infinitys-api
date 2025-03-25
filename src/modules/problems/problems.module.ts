import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { ProblemsAdminController } from './problems.admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { AssetsModule } from 'src/modules/assets/assets.module';

@Module({
	imports: [TypeOrmModule.forFeature([Problem]), AssetsModule],
	controllers: [ProblemsController, ProblemsAdminController],
	providers: [ProblemsService],
	exports: [ProblemsService],
})
export class ProblemsModule {}
