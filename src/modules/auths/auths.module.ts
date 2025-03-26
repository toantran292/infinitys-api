import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UsersModule } from '../users/users.module';

import { AuthsAdminController } from './auths.admin.controller';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';
import { JwtStrategy } from './jwt.strategy';
import { PublicStrategy } from './public.strategy';

@Module({
	imports: [
		forwardRef(() => UsersModule),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			inject: [ApiConfigService],
			useFactory: (configService: ApiConfigService) => ({
				privateKey: configService.authConfig.privateKey,
				publicKey: configService.authConfig.publicKey,
				signOptions: {
					algorithm: 'RS256',
				},
				verifyOptions: {
					algorithms: ['RS256'],
				},
			}),
		}),
	],
	controllers: [AuthsAdminController, AuthsController],
	providers: [AuthsService, JwtStrategy, PublicStrategy],
	exports: [JwtModule, AuthsService],
})
export class AuthsModule {}
