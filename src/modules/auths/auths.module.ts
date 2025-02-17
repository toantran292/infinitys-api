import { Module } from '@nestjs/common';
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

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forFeature([UserEntity]),
		UsersModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
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
	exports: [AuthsService, JwtModule, PassportModule],
	controllers: [AuthsAdminController, AuthsController],
	providers: [AuthsService, JwtStrategy],
})
export class AuthsModule {}
