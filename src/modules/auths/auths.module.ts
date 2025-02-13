import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';

dotenv.config();
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		UsersModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: { expiresIn: '3h' },
		}),
	],
	exports: [AuthsService, JwtModule, PassportModule],
	controllers: [AuthsController],
	providers: [AuthsService, JwtStrategy],
})
export class AuthsModule {}
