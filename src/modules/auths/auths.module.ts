import { forwardRef, Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthsAdminController } from './auths.admin.controller';
import { PublicStrategy } from './public.strategy';
import { ApiConfigService } from '../../shared/services/api-config.service';

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
