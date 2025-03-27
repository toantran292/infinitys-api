import { forwardRef, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { AssetsModule } from '../assets/assets.module';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
	imports: [
		AssetsModule,
		ElasticsearchModule.registerAsync({
			imports: [SharedModule],
			inject: [ApiConfigService],
			useFactory: async (configService: ApiConfigService) => ({
				node: configService.elasticsearchConfig.node,
				auth: {
					username: configService.elasticsearchConfig.username,
					password: configService.elasticsearchConfig.password,
				},
			}),
		}),
		forwardRef(() => UsersModule),
	],
	controllers: [SearchController],
	providers: [SearchService],
	exports: [SearchService],
})
export class SearchModule {}
