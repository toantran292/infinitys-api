import { forwardRef, Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthsAdminController } from './auths.admin.controller';
import { PublicStrategy } from './public.strategy';

@Module({
	imports: [
		forwardRef(() => UsersModule),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRESIN') || '3h',
				},
			}),
		}),
	],
	controllers: [AuthsAdminController, AuthsController],
	providers: [AuthsService, JwtStrategy, PublicStrategy],
	exports: [JwtModule, AuthsService],
})
export class AuthsModule {}
